import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { hashPassword } from "@/lib/utils"
import { Checkbox } from '@/components/ui/checkbox'

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const auth = useAuth()
    const [remember, setRemember] = useState(false)

    async function handleLogin(event) {
        event.preventDefault()
        try {
            setError(null)
            // attempt login via auth context (pass remember flag)
            await auth.login(username.trim(), password, remember)
            // optionally remember username for prefill
            if (remember) localStorage.setItem('rememberUsername', username.trim())
            else localStorage.removeItem('rememberUsername')
            navigate('/orders')
        } catch (err) {
            console.error(err)
            setError(err.message || 'Login failed')
        }
    }

    // load remembered username if present
    useEffect(() => {
        const r = localStorage.getItem('rememberUsername')
        if (r) setUsername(r)
    }, [])

    return (
        <main className="w-full max-w-lg h-100 mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
            <form onSubmit={handleLogin}>
                <p className="text-2xl font-semibold mb-6 text-center">
                    Login
                </p>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </Field>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                                    <label htmlFor="remember" className="text-sm">Remember me</label>
                                </div>
                        <Button type="submit" className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700">
                            Login
                        </Button>
                    </FieldGroup>
                </FieldSet>
            </form>
        </main>
    )
}

export default Login