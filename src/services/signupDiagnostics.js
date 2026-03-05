// Signup Diagnostics - Log every step of the signup process
import { supabase } from './supabaseClient'

export const signupDiagnostics = {
  async testSignup(email, password, fullName, role) {
    const logs = []
    
    try {
      logs.push('=== SIGNUP DIAGNOSTICS START ===')
      logs.push(`Email: ${email}`)
      logs.push(`Full Name: ${fullName}`)
      logs.push(`Role: ${role}`)
      logs.push('')

      // Step 1: Create auth user
      logs.push('STEP 1: Creating auth user...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          }
        }
      })

      if (authError) {
        logs.push(`❌ Auth creation failed: ${authError.message}`)
        logs.push(`Error code: ${authError.status}`)
        return { success: false, logs }
      }

      if (!authData.user) {
        logs.push('❌ Auth user is null')
        return { success: false, logs }
      }

      const userId = authData.user.id
      logs.push(`✅ Auth user created: ${userId}`)
      logs.push('')

      // Step 2: Create profile
      logs.push('STEP 2: Creating profile...')
      const { error: profileErr } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email,
            full_name: fullName,
            role,
          },
        ])

      if (profileErr) {
        logs.push(`❌ Profile creation failed: ${profileErr.message}`)
        logs.push(`Error code: ${profileErr.code}`)
        logs.push(`Error details: ${JSON.stringify(profileErr)}`)
        return { success: false, logs }
      }

      logs.push('✅ Profile created')
      logs.push('')

      // Step 3: Verify profile was created
      logs.push('STEP 3: Verifying profile...')
      const { data: profileData, error: profileCheckErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileCheckErr) {
        logs.push(`❌ Profile verification failed: ${profileCheckErr.message}`)
        return { success: false, logs }
      }

      logs.push(`✅ Profile verified: ${JSON.stringify(profileData)}`)
      logs.push('')

      // Step 4: Create role-specific record
      logs.push(`STEP 4: Creating ${role} record...`)
      
      let roleErr = null
      if (role === 'braider') {
        const result = await supabase
          .from('braiders')
          .insert([{ id: userId }])
        roleErr = result.error
      } else if (role === 'customer') {
        const result = await supabase
          .from('customers')
          .insert([{ id: userId }])
        roleErr = result.error
      }

      if (roleErr) {
        logs.push(`❌ ${role} record creation failed: ${roleErr.message}`)
        logs.push(`Error code: ${roleErr.code}`)
        logs.push(`Error details: ${JSON.stringify(roleErr)}`)
        return { success: false, logs }
      }

      logs.push(`✅ ${role} record created`)
      logs.push('')

      // Step 5: Verify role-specific record
      logs.push(`STEP 5: Verifying ${role} record...`)
      const tableName = role === 'braider' ? 'braiders' : 'customers'
      const { data: roleData, error: roleCheckErr } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', userId)
        .single()

      if (roleCheckErr) {
        logs.push(`❌ ${role} record verification failed: ${roleCheckErr.message}`)
        return { success: false, logs }
      }

      logs.push(`✅ ${role} record verified: ${JSON.stringify(roleData)}`)
      logs.push('')

      logs.push('=== SIGNUP DIAGNOSTICS SUCCESS ===')
      return { success: true, logs, userId }

    } catch (error) {
      logs.push(`❌ Unexpected error: ${error.message}`)
      logs.push(`Stack: ${error.stack}`)
      return { success: false, logs }
    }
  },

  // Log all diagnostics to console
  logToConsole(logs) {
    console.group('📋 SIGNUP DIAGNOSTICS')
    logs.forEach(log => {
      if (log.includes('✅')) {
        console.log('%c' + log, 'color: green; font-weight: bold;')
      } else if (log.includes('❌')) {
        console.log('%c' + log, 'color: red; font-weight: bold;')
      } else if (log.includes('STEP')) {
        console.log('%c' + log, 'color: blue; font-weight: bold;')
      } else if (log === '') {
        console.log('')
      } else {
        console.log(log)
      }
    })
    console.groupEnd()
  },

  // Export logs as text
  exportLogs(logs) {
    return logs.join('\n')
  }
}
