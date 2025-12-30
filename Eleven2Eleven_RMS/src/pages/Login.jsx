import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Checkbox } from '@/components/ui/checkbox'
// Import thêm icon cảnh báo cho đẹp (nếu bạn có cài lucide-react)
import { AlertCircle } from "lucide-react"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // State lưu nội dung lỗi
    const [error, setError] = useState("") 
    const navigate = useNavigate()
    const auth = useAuth()
    const [remember, setRemember] = useState(false)

    async function handleLogin(event) {
        event.preventDefault()
        setError("") // Reset lỗi mỗi khi bấm nút đăng nhập lại

        // --- 1. KIỂM TRA ĐẦU VÀO (VALIDATION) ---
        
        // Kiểm tra username trống
        if (!username.trim()) {
            setError("Vui lòng nhập tên đăng nhập.")
            return // Dừng lại không gửi request
        }

        // Kiểm tra password trống
        if (!password) {
            setError("Vui lòng nhập mật khẩu.")
            return // Dừng lại không gửi request
        }

        try {
            // --- 2. GỬI YÊU CẦU ĐĂNG NHẬP ---
            await auth.login(username.trim(), password, remember)
            
            // Xử lý nhớ tài khoản
            if (remember) localStorage.setItem('rememberUsername', username.trim())
            else localStorage.removeItem('rememberUsername')
            
            navigate('/orders')
        } catch (err) {
            console.error("Login error:", err)
            
            // --- 3. XỬ LÝ LỖI TỪ SERVER TRẢ VỀ ---
            // Lưu ý: auth.login cần phải ném ra Error chứa message cụ thể
            // Ví dụ backend trả về message: "User not found" hoặc "Wrong password"
            
            const serverMessage = err.message || "";

            if (serverMessage.includes("User not found") || serverMessage.includes("tồn tại")) {
                setError("Tài khoản không tồn tại trong hệ thống.");
            } 
            else if (serverMessage.includes("Wrong password") || serverMessage.includes("mật khẩu")) {
                setError("Mật khẩu không đúng. Vui lòng thử lại.");
            } 
            else {
                // Lỗi chung chung (Mất mạng, lỗi server 500...)
                setError("Đăng nhập thất bại. Mật khẩu không chính xác.");
            }
        }
    }

    // Tự động điền username nếu đã nhớ trước đó
    useEffect(() => {
        const r = localStorage.getItem('rememberUsername')
        if (r) setUsername(r)
    }, [])

    return (
        <main className="w-full max-w-lg h-100 mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <form onSubmit={handleLogin}>
                <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">
                    Đăng Nhập
                </h1>

                {/* --- KHU VỰC HIỂN THỊ LỖI (DÒNG CHỮ ĐỎ) --- */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Icon cảnh báo (dấu chấm than) */}
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    // Mẹo UX: Khi người dùng bắt đầu sửa lại, nên ẩn lỗi đi ngay
                                    if (error) setError("") 
                                }}
                                placeholder="Nhập tên đăng nhập..."
                                // Thêm viền đỏ vào ô input nếu đang có lỗi
                                className={error ? "border-red-500 focus:ring-red-500" : ""}
                            />
                        </Field>
                        
                        <Field>
                            <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (error) setError("")
                                }}
                                placeholder="Nhập mật khẩu..."
                                className={error ? "border-red-500 focus:ring-red-500" : ""}
                            />
                        </Field>
                        
                        <div className="flex items-center gap-2 mt-2">
                            <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                            <label htmlFor="remember" className="text-sm cursor-pointer select-none text-slate-600">
                                Ghi nhớ đăng nhập
                            </label>
                        </div>

                        <Button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2">
                            Đăng Nhập
                        </Button>
                    </FieldGroup>
                </FieldSet>
            </form>
        </main>
    )
}

export default Login