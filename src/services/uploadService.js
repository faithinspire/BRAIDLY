/**
 * CENTRALIZED FILE UPLOAD SERVICE
 * Handles all file uploads with validation, retry logic, and progress tracking
 */

import { supabase } from './supabase'

// Configuration
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  COMPRESSION_QUALITY: 0.8,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // ms
  BUCKETS: {
    AVATARS: 'avatars',
    PORTFOLIO: 'portfolio',
    GALLERY: 'gallery'
  }
}

/**
 * Validate file before upload
 */
export function validateFile(file) {
  const errors = []

  // Check file exists
  if (!file) {
    errors.push('No file selected')
    return { valid: false, errors }
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`)
  }

  // Check file type
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Only JPG, PNG, and WebP are allowed')
  }

  // Check file extension
  const ext = '.' + file.name.split('.').pop().toLowerCase()
  if (!UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
    errors.push('Invalid file extension')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Compress image before upload
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Calculate new dimensions (max 2000px)
        let width = img.width
        let height = img.height
        const maxDim = 2000
        
        if (width > height) {
          if (width > maxDim) {
            height = (height * maxDim) / width
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = (width * maxDim) / height
            height = maxDim
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          },
          'image/jpeg',
          UPLOAD_CONFIG.COMPRESSION_QUALITY
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Generate unique file path
 */
function generateFilePath(bucketType, userId, fileName) {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const cleanName = fileName
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase()
  
  return `${userId}/${timestamp}-${random}-${cleanName}`
}

/**
 * Upload file with retry logic
 */
async function uploadWithRetry(bucket, path, file, onProgress, retries = 0) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        onUploadProgress: (progress) => {
          const percent = (progress.loaded / progress.total) * 100
          onProgress?.(percent)
        }
      })

    if (error) {
      if (retries < UPLOAD_CONFIG.MAX_RETRIES) {
        console.warn(`Upload failed, retrying... (${retries + 1}/${UPLOAD_CONFIG.MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, UPLOAD_CONFIG.RETRY_DELAY))
        return uploadWithRetry(bucket, path, file, onProgress, retries + 1)
      }
      throw error
    }

    return data
  } catch (error) {
    if (retries < UPLOAD_CONFIG.MAX_RETRIES) {
      console.warn(`Upload error, retrying... (${retries + 1}/${UPLOAD_CONFIG.MAX_RETRIES})`)
      await new Promise(resolve => setTimeout(resolve, UPLOAD_CONFIG.RETRY_DELAY))
      return uploadWithRetry(bucket, path, file, onProgress, retries + 1)
    }
    throw error
  }
}

/**
 * Get public URL for uploaded file
 */
function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(userId, file, onProgress) {
  try {
    console.log('📸 Starting avatar upload for user:', userId)
    
    // Validate
    const validation = validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    // Compress
    const compressed = await compressImage(file)

    // Generate path
    const path = generateFilePath('avatars', userId, compressed.name)
    console.log('📁 Upload path:', path)

    // Upload
    const uploadResult = await uploadWithRetry(UPLOAD_CONFIG.BUCKETS.AVATARS, path, compressed, onProgress)
    console.log('✅ Upload successful:', uploadResult)

    // Get public URL
    const publicUrl = getPublicUrl(UPLOAD_CONFIG.BUCKETS.AVATARS, path)
    console.log('🔗 Public URL:', publicUrl)

    if (!publicUrl) {
      throw new Error('Failed to generate public URL')
    }

    return {
      success: true,
      url: publicUrl,
      path
    }
  } catch (error) {
    console.error('❌ Avatar upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload avatar'
    }
  }
}

/**
 * Upload portfolio image
 */
export async function uploadPortfolioImage(userId, file, caption, category, onProgress) {
  try {
    console.log('🖼️ Starting portfolio upload for user:', userId)
    
    // Validate
    const validation = validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '))
    }

    // Compress
    const compressed = await compressImage(file)

    // Generate path
    const path = generateFilePath('portfolio', userId, compressed.name)
    console.log('📁 Upload path:', path)

    // Upload
    const uploadResult = await uploadWithRetry(UPLOAD_CONFIG.BUCKETS.PORTFOLIO, path, compressed, onProgress)
    console.log('✅ Upload successful:', uploadResult)

    // Get public URL
    const publicUrl = getPublicUrl(UPLOAD_CONFIG.BUCKETS.PORTFOLIO, path)
    console.log('🔗 Public URL:', publicUrl)

    if (!publicUrl) {
      throw new Error('Failed to generate public URL')
    }

    return {
      success: true,
      url: publicUrl,
      path,
      caption: caption || compressed.name.split('.')[0],
      category: category || 'Box Braids'
    }
  } catch (error) {
    console.error('❌ Portfolio upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload portfolio image'
    }
  }
}

/**
 * Delete uploaded file
 */
export async function deleteFile(bucket, path) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete file'
    }
  }
}

/**
 * Get upload progress percentage
 */
export function getUploadProgress(loaded, total) {
  return Math.round((loaded / total) * 100)
}

export default {
  validateFile,
  compressImage,
  uploadAvatar,
  uploadPortfolioImage,
  deleteFile,
  getUploadProgress,
  UPLOAD_CONFIG
}
