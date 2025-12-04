import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    async function handleLogin(event) {
        event.preventDefault()
    }

    return (
        <main className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md">
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