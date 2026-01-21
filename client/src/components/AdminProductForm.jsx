import { useState, useEffect } from 'react';

const AdminProductForm = ({ productToEdit, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: 0,
        type: 'product'
    });

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                title: productToEdit.title,
                description: productToEdit.description,
                price: productToEdit.price,
                imageUrl: productToEdit.imageUrl,
                category: productToEdit.category,
                stock: productToEdit.stock,
                type: productToEdit.type || 'product'
            });
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = productToEdit
            ? `/api/products/${productToEdit._id}`
            : '/api/products';

        const method = productToEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div className="bg-base-100 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{productToEdit ? 'Edit Product/Service' : 'Add New Product/Service'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label className="label">Price</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label className="label">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label className="label">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input input-bordered w-full" required />
                </div>

                <div className="form-control">
                    <label className="label">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="select select-bordered w-full">
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">Image URL</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input input-bordered w-full" required />
                </div>

                <div className="form-control md:col-span-2">
                    <label className="label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered w-full h-24" required></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
                    <button type="submit" className="btn btn-primary">{productToEdit ? 'Update' : 'Create'}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
