import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './src/utils/supabase'
import SignIn from './src/page/SignIn'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import TodoPage from './src/page/TodoPage'

export default App = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <TodoPage /> : <SignIn />}
    </View>
  )
}