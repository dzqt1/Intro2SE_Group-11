import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Search, Filter, Edit, Eye, EyeOff } from 'lucide-react'

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Black Coffee',
      description: 'Traditional Vietnamese black coffee',
      price: 25000,
      category: 'Drinks',
      available: true,
      preparationTime: 5,
      image: null
    },
    {
      id: 2,
      name: 'Milk Coffee',
      description: 'Coffee with condensed milk',
      price: 30000,
      category: 'Drinks',
      available: true,
      preparationTime: 7,
      image: null
    },
    {
      id: 3,
      name: 'Beef Sandwich',
      description: 'Grilled beef with vegetables',
      price: 45000,
      category: 'Food',
      available: true,
      preparationTime: 15,
      image: null
    }
  ])

  const [categories] = useState(['All', 'Drinks', 'Food', 'Desserts', 'Snacks'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Drinks',
    preparationTime: '',
    available: true
  })

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      if (editingId) {
        setMenuItems(menuItems.map(item =>
          item.id === editingId ? { ...newItem, id: editingId, price: parseInt(newItem.price), preparationTime: parseInt(newItem.preparationTime) } : item
        ))
        setEditingId(null)
      } else {
        setMenuItems([...menuItems, {
          ...newItem,
          id: menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1,
          price: parseInt(newItem.price),
          preparationTime: parseInt(newItem.preparationTime)
        }])
      }
      setNewItem({
        name: '',
        description: '',
        price: '',
        category: 'Drinks',
        preparationTime: '',
        available: true
      })
      setShowForm(false)
    }
  }

  const handleDeleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
  }

  const handleEditItem = (item) => {
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      preparationTime: item.preparationTime,
      available: item.available
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ))
  }

  const handleCancel = () => {
    setShowForm(false)
    setNewItem({
      name: '',
      description: '',
      price: '',
      category: 'Drinks',
      preparationTime: '',
      available: true
    })
    setEditingId(null)
  }

  return (
    <div className="flex-1 p-8 overflow-auto bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
            <p className="text-gray-600 mt-1">Manage your restaurant menu items</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Item'}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card className="p-6 mb-8 border border-gray-300 bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Item Name</Label>
                <Input
                  placeholder="e.g., Black Coffee"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Price (VNĐ)</Label>
                <Input
                  placeholder="e.g., 25000"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Preparation Time (minutes)</Label>
                <Input
                  placeholder="e.g., 5"
                  type="number"
                  value={newItem.preparationTime}
                  onChange={(e) => setNewItem({ ...newItem, preparationTime: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Input
                  placeholder="Brief description of the item"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddItem}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {editingId ? 'Update Item' : 'Save Item'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full">
              <Card className="p-8 text-center bg-white border border-gray-300">
                <p className="text-gray-500 text-lg">No menu items found. Add your first item!</p>
              </Card>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="p-6 border border-gray-300 bg-white hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-semibold">{item.price.toLocaleString('vi-VN')}đ</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Prep time: {item.preparationTime} min</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEditItem(item)}
                    size="sm"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 gap-1"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => toggleAvailability(item.id)}
                    size="sm"
                    variant="outline"
                    className="gap-1"
                  >
                    {item.available ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {item.available ? 'Hide' : 'Show'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">{menuItems.length}</div>
              <div className="text-sm text-blue-600">Total Items</div>
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {menuItems.filter(item => item.available).length}
              </div>
              <div className="text-sm text-green-600">Available</div>
            </div>
          </Card>
          <Card className="p-4 bg-orange-50 border border-orange-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">
                {categories.filter(cat => cat !== 'All').length}
              </div>
              <div className="text-sm text-orange-600">Categories</div>
            </div>
          </Card>
          <Card className="p-4 bg-purple-50 border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-700">
                {Math.round(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length) || 0}
              </div>
              <div className="text-sm text-purple-600">Avg Price</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
