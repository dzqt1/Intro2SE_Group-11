import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Search, Edit } from 'lucide-react'

export default function IngredientManagement() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Thịt gà (Chicken)', unit: 'gram', quantity: 500 },
    { id: 2, name: 'Thịt bò (Beef)', unit: 'gram', quantity: 500 },
    { id: 3, name: 'Trứng (Eggs)', unit: 'quả', quantity: 4 },
    { id: 4, name: 'Gạo (Rice)', unit: 'gram', quantity: 300 },
    { id: 5, name: 'Bánh mì kẹp (Burger Buns)', unit: 'cái', quantity: 4 },
    { id: 6, name: 'Xà lách Romaine (Caesar Salad)', unit: 'gram', quantity: 100 },
    { id: 7, name: 'Bơ (Butter)', unit: 'gram', quantity: 50 },
    { id: 8, name: 'Sữa (Milk/Cream)', unit: 'ml', quantity: 100 },
    { id: 9, name: 'Phô mai Cottage (Cottage Cheese)', unit: 'gram', quantity: 150 },
    { id: 10, name: 'Bột mì (Flour) (dùng làm bánh/sốt)', unit: 'gram', quantity: 100 },
    { id: 11, name: 'Cà chua (Tomato)', unit: 'quả', quantity: 2 },
    { id: 12, name: 'Hành tây (Onion)', unit: 'củ', quantity: 1 },
    { id: 13, name: 'Nước cam (Orange)', unit: 'ml', quantity: 250 },
    { id: 14, name: 'Quả mọng (Berries)', unit: 'gram', quantity: 100 },
    { id: 15, name: 'Yến mạch (Oatmeal)', unit: 'gram', quantity: 80 },
    { id: 16, name: 'Cà phê (Coffee)', unit: 'gram', quantity: 20 },
    { id: 17, name: 'Sô cô la (Chocolate)', unit: 'gram', quantity: 50 },
    { id: 18, name: 'Gia vị (Muối, Tiêu, Bột cà ri)', unit: 'gram', quantity: 0 },
    { id: 19, name: 'Dầu ăn (Oil)', unit: 'ml', quantity: 50 },
    { id: 20, name: 'Lá trà xanh (Green Tea)', unit: 'gram', quantity: 10 }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    unit: '',
    quantity: ''
  })

  // Filter ingredients based on search
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [ingredients, searchTerm])

  const handleAddClick = () => {
    setEditingId(null)
    setNewItem({
      name: '',
      unit: '',
      quantity: ''
    })
    setShowForm(true)
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setNewItem({ ...item })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!newItem.name || !newItem.unit) {
      alert('Vui lòng điền đầy đủ tên nguyên liệu và đơn vị')
      return
    }

    if (editingId) {
      setIngredients(ingredients.map(item =>
        item.id === editingId 
          ? { 
              ...newItem, 
              id: editingId,
              quantity: parseFloat(newItem.quantity) || 0
            } 
          : item
      ))
    } else {
      const id = Math.max(...ingredients.map(i => i.id), 0) + 1
      setIngredients([...ingredients, { 
        ...newItem, 
        id,
        quantity: parseFloat(newItem.quantity) || 0
      }])
    }

    setShowForm(false)
    setNewItem({
      name: '',
      unit: '',
      quantity: ''
    })
  }

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      setIngredients(ingredients.filter(item => item.id !== id))
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? value : value
    }))
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Nguyên Liệu</h1>
          <p className="text-gray-600">Quản lý danh sách nguyên liệu trong nhà hàng</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tìm kiếm nguyên liệu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Thêm Nguyên Liệu
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Chỉnh Sửa Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
            </h2>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Tên Nguyên Liệu *</Label>
                <Input
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Thịt gà"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Đơn Vị *</Label>
                <Input
                  name="unit"
                  value={newItem.unit}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: gram, ml, cái"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Số Lượng</Label>
                <Input
                  type="number"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Cập Nhật' : 'Thêm'}
              </Button>
            </div>
          </Card>
        )}

        {/* Ingredients Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tên Nguyên Liệu</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Đơn Vị</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Số Lượng</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Không tìm thấy nguyên liệu
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Tổng Nguyên Liệu</p>
            <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Nguyên Liệu Được Hiển Thị</p>
            <p className="text-2xl font-bold text-gray-900">{filteredIngredients.length}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
