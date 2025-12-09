import React, { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Search, Edit } from 'lucide-react'

export default function IngredientManagement() {
  const [ingredients, setIngredients] = useState([
    {
      id: 1,
      name: 'Robusta Coffee Beans',
      category: 'Coffee',
      unit: 'kg',
      quantity: 50,
      reorderLevel: 10,
      supplier: 'Local Coffee Co.',
      price: 250000,
      expiryDate: '2025-12-31'
    },
    {
      id: 2,
      name: 'Condensed Milk',
      category: 'Dairy',
      unit: 'liter',
      quantity: 30,
      reorderLevel: 5,
      supplier: 'Dairy Products Inc.',
      price: 150000,
      expiryDate: '2025-12-20'
    },
    {
      id: 3,
      name: 'Fresh Beef',
      category: 'Meat',
      unit: 'kg',
      quantity: 15,
      reorderLevel: 8,
      supplier: 'Fresh Meat Market',
      price: 500000,
      expiryDate: '2025-12-12'
    },
    {
      id: 4,
      name: 'Bread',
      category: 'Bakery',
      unit: 'piece',
      quantity: 100,
      reorderLevel: 20,
      supplier: 'Local Bakery',
      price: 50000,
      expiryDate: '2025-12-11'
    }
  ])

  const [categories] = useState(['All', 'Coffee', 'Dairy', 'Meat', 'Bakery', 'Vegetables', 'Spices'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    unit: '',
    quantity: '',
    reorderLevel: '',
    supplier: '',
    price: '',
    expiryDate: ''
  })

  // Filter ingredients based on search and category
  const filteredIngredients = useMemo(() => {
    return ingredients.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [ingredients, searchTerm, selectedCategory])

  const handleAddClick = () => {
    setEditingId(null)
    setNewItem({
      name: '',
      category: '',
      unit: '',
      quantity: '',
      reorderLevel: '',
      supplier: '',
      price: '',
      expiryDate: ''
    })
    setShowForm(true)
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setNewItem(item)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!newItem.name || !newItem.category || !newItem.supplier) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      setIngredients(ingredients.map(item =>
        item.id === editingId ? { ...newItem, id: editingId } : item
      ))
    } else {
      const id = Math.max(...ingredients.map(i => i.id), 0) + 1
      setIngredients([...ingredients, { ...newItem, id }])
    }

    setShowForm(false)
    setNewItem({
      name: '',
      category: '',
      unit: '',
      quantity: '',
      reorderLevel: '',
      supplier: '',
      price: '',
      expiryDate: ''
    })
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this ingredient?')) {
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
      [name]: name === 'quantity' || name === 'reorderLevel' || name === 'price' ? parseFloat(value) || '' : value
    }))
  }

  // Check for low stock items
  const lowStockItems = filteredIngredients.filter(item => item.quantity <= item.reorderLevel)

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredient Management</h1>
          <p className="text-gray-600">Manage restaurant ingredients and inventory</p>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="mb-6 p-4 bg-yellow-50 border-yellow-200">
            <p className="text-yellow-800 font-semibold">⚠️ Warning: {lowStockItems.length} ingredient(s) at low stock</p>
          </Card>
        )}

        {/* Action Bar */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search ingredients by name or supplier..."
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
              Add Ingredient
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-blue-600 text-white' : ''}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Ingredient' : 'Add New Ingredient'}
            </h2>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Name *</Label>
                <Input
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Robusta Coffee Beans"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Category *</Label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium">Unit</Label>
                <select
                  name="unit"
                  value={newItem.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select unit</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="liter">Liter (l)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="piece">Piece</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium">Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Reorder Level</Label>
                <Input
                  type="number"
                  name="reorderLevel"
                  value={newItem.reorderLevel}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Price (VND)</Label>
                <Input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Supplier *</Label>
                <Input
                  name="supplier"
                  value={newItem.supplier}
                  onChange={handleInputChange}
                  placeholder="e.g., Local Coffee Co."
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Expiry Date</Label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={newItem.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editingId ? 'Update' : 'Add'} Ingredient
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reorder Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Supplier</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                      No ingredients found
                    </td>
                  </tr>
                ) : (
                  filteredIngredients.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.reorderLevel} {item.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.price?.toLocaleString('vi-VN')} ₫</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.expiryDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {item.quantity <= item.reorderLevel ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(item)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Total Ingredients</p>
            <p className="text-2xl font-bold text-gray-900">{ingredients.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Low Stock Items</p>
            <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Total Categories</p>
            <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {(ingredients.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) / 1000000).toFixed(2)}M ₫
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
