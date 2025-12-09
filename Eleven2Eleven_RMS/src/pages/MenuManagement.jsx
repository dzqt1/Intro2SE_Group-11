import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Search, Filter, Edit, Eye, EyeOff } from 'lucide-react'

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    // Breakfast
    { id: 1, name: 'Berries', description: 'Fresh berries bowl', price: 12, category: 'Breakfast', available: true, preparationTime: 5 },
    { id: 2, name: 'Cold Cereal', description: 'Chilled breakfast cereal', price: 13, category: 'Breakfast', available: true, preparationTime: 3 },
    { id: 3, name: 'Cottage Cheese', description: 'Fresh cottage cheese', price: 12, category: 'Breakfast', available: true, preparationTime: 2 },
    { id: 4, name: 'Eggs', description: 'Fried eggs', price: 8, category: 'Breakfast', available: true, preparationTime: 8 },
    { id: 5, name: 'Green Tea', description: 'Hot green tea', price: 14, category: 'Breakfast', available: true, preparationTime: 3 },
    { id: 6, name: 'Oatmeal', description: 'Warm oatmeal', price: 12, category: 'Breakfast', available: true, preparationTime: 5 },
    { id: 7, name: 'Peanut Butter', description: 'Toast with peanut butter', price: 11, category: 'Breakfast', available: true, preparationTime: 4 },

    // Salad
    { id: 8, name: 'Antipasto Salad', description: 'Italian antipasto mix', price: 12, category: 'Salad', available: true, preparationTime: 8 },
    { id: 9, name: 'BBQ Pork Salad', description: 'BBQ pork with greens', price: 13, category: 'Salad', available: true, preparationTime: 10 },
    { id: 10, name: 'Broccoli Rapa', description: 'Sautéed broccoli rapa', price: 12, category: 'Salad', available: true, preparationTime: 7 },
    { id: 11, name: 'Caesar Salad', description: 'Classic caesar salad', price: 8, category: 'Salad', available: true, preparationTime: 6 },
    { id: 12, name: 'Chicken Salad', description: 'Grilled chicken salad', price: 14, category: 'Salad', available: true, preparationTime: 9 },
    { id: 13, name: 'Crispy Salad', description: 'Crispy mixed vegetables', price: 12, category: 'Salad', available: true, preparationTime: 8 },
    { id: 14, name: 'Ponir Mix Salad', description: 'Mixed paneer salad', price: 11, category: 'Salad', available: true, preparationTime: 7 },

    // Rice Bowl
    { id: 15, name: 'Butter Chicken Rice', description: 'Creamy butter chicken over rice', price: 12, category: 'Rice Bowl', available: true, preparationTime: 12 },
    { id: 16, name: 'Chicken Biryani', description: 'Fragrant chicken biryani', price: 13, category: 'Rice Bowl', available: true, preparationTime: 15 },
    { id: 17, name: 'Beef Biryani', description: 'Spiced beef biryani', price: 12, category: 'Rice Bowl', available: true, preparationTime: 15 },
    { id: 18, name: 'Rice Beef', description: 'Beef with fried rice', price: 8, category: 'Rice Bowl', available: true, preparationTime: 10 },
    { id: 19, name: 'Veg Biryani', description: 'Vegetable biryani', price: 11, category: 'Rice Bowl', available: true, preparationTime: 12 },
    { id: 20, name: 'Plain Rice', description: 'Steamed plain rice', price: 11, category: 'Rice Bowl', available: true, preparationTime: 5 },

    // Chicken
    { id: 21, name: 'Finger Chicken', description: 'Fried chicken fingers', price: 12, category: 'Chicken', available: true, preparationTime: 10 },
    { id: 22, name: 'Chicken Grilled', description: 'Grilled chicken breast', price: 13, category: 'Chicken', available: true, preparationTime: 12 },
    { id: 23, name: 'Chicken Grilled with Butter', description: 'Butter grilled chicken', price: 12, category: 'Chicken', available: true, preparationTime: 13 },
    { id: 24, name: 'Chicken Wrap', description: 'Chicken in tortilla wrap', price: 8, category: 'Chicken', available: true, preparationTime: 8 },
    { id: 25, name: 'Chicken Marsala', description: 'Chicken in marsala sauce', price: 14, category: 'Chicken', available: true, preparationTime: 14 },
    { id: 26, name: 'Chicken Francese', description: 'Chicken francese style', price: 12, category: 'Chicken', available: true, preparationTime: 12 },
    { id: 27, name: 'Chicken Prame', description: 'Chicken prame preparation', price: 11, category: 'Chicken', available: true, preparationTime: 11 },

    // Crazy Beef
    { id: 28, name: 'BBQ Beef', description: 'BBQ beef platter', price: 12, category: 'Crazy Beef', available: true, preparationTime: 12 },
    { id: 29, name: 'Beef Fries', description: 'Beef with crispy fries', price: 13, category: 'Crazy Beef', available: true, preparationTime: 10 },
    { id: 30, name: 'Beef Burger', description: 'Classic beef burger', price: 12, category: 'Crazy Beef', available: true, preparationTime: 10 },
    { id: 31, name: 'Beef Grilled', description: 'Grilled beef steak', price: 8, category: 'Crazy Beef', available: true, preparationTime: 12 },
    { id: 32, name: 'Beef Meal', description: 'Complete beef meal', price: 14, category: 'Crazy Beef', available: true, preparationTime: 14 },
    { id: 33, name: 'Beef Meat Steak', description: 'Premium beef steak', price: 14, category: 'Crazy Beef', available: true, preparationTime: 15 },
    { id: 34, name: 'Beef Bogorok', description: 'Beef bogorok style', price: 11, category: 'Crazy Beef', available: true, preparationTime: 11 },

    // Burger
    { id: 35, name: 'Luger Burger', description: 'Juicy luger burger', price: 12, category: 'Burger', available: true, preparationTime: 10 },
    { id: 36, name: 'Le Pigeon Burger', description: 'Le pigeon special burger', price: 13, category: 'Burger', available: true, preparationTime: 11 },
    { id: 37, name: 'Double Animal Style', description: 'Double beef animal style', price: 12, category: 'Burger', available: true, preparationTime: 11 },
    { id: 38, name: 'The Original Burger', description: 'Original classic burger', price: 8, category: 'Burger', available: true, preparationTime: 9 },
    { id: 39, name: 'Whiskey King Burger', description: 'Whiskey king special', price: 14, category: 'Burger', available: true, preparationTime: 12 },
    { id: 40, name: 'The Company Burger', description: 'Company signature burger', price: 12, category: 'Burger', available: true, preparationTime: 10 },
    { id: 41, name: 'Dyer\'s Deep-Fried Burger', description: 'Deep fried burger', price: 12, category: 'Burger', available: true, preparationTime: 11 },
    { id: 42, name: 'The Lola Burger', description: 'Lola special burger', price: 11, category: 'Burger', available: true, preparationTime: 10 },

    // Cake
    { id: 43, name: 'Black Forest Gateau', description: 'Classic black forest cake', price: 12, category: 'Cake', available: true, preparationTime: 3 },
    { id: 44, name: 'Pineapple Cake', description: 'Fresh pineapple cake', price: 11, category: 'Cake', available: true, preparationTime: 3 },
    { id: 45, name: 'Eggless Truffle Cake', description: 'Eggless chocolate truffle', price: 11, category: 'Cake', available: true, preparationTime: 2 },
    { id: 46, name: 'Coffee Cake with Mocha Frosting', description: 'Coffee cake with mocha', price: 13, category: 'Cake', available: true, preparationTime: 3 },
    { id: 47, name: 'Fudgy Chocolate Cake', description: 'Fudgy chocolate delight', price: 11, category: 'Cake', available: true, preparationTime: 3 },
    { id: 48, name: 'Mango Meringue Cake', description: 'Mango meringue cake', price: 12, category: 'Cake', available: true, preparationTime: 3 },

    // Juice
    { id: 49, name: 'Orange Juice', description: 'Fresh orange juice', price: 12, category: 'Juice', available: true, preparationTime: 2 },
    { id: 50, name: 'Lemonade', description: 'Fresh lemonade', price: 8, category: 'Juice', available: true, preparationTime: 2 },
    { id: 51, name: 'Apple Juice', description: 'Fresh apple juice', price: 13, category: 'Juice', available: true, preparationTime: 2 },
    { id: 52, name: 'Grape Juice', description: 'Fresh grape juice', price: 15, category: 'Juice', available: true, preparationTime: 2 },
    { id: 53, name: 'Pineapple Juice', description: 'Fresh pineapple juice', price: 14, category: 'Juice', available: true, preparationTime: 2 },
    { id: 54, name: 'Cranberry Juice', description: 'Fresh cranberry juice', price: 16, category: 'Juice', available: true, preparationTime: 2 }
  ])

  const [categories] = useState(['All', 'Breakfast', 'Salad', 'Rice Bowl', 'Chicken', 'Crazy Beef', 'Burger', 'Cake', 'Juice'])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
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
        category: 'Breakfast',
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
      category: 'Breakfast',
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
