import { useEffect, useState, useCallback } from 'react';
import {
  RiAddLine, RiSearchLine, RiEditLine, RiDeleteBinLine,
  RiFilterLine, RiShoppingBagLine, RiCloseLine, RiImageLine,
} from 'react-icons/ri';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Food & Beverage'];

const emptyForm = { title: '', category: '', price: '', stock: '', image: '', description: '', tags: '' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('lowStock') === 'true') setLowStockFilter(true);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (lowStockFilter) params.lowStock = true;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, lowStockFilter, page]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image || '',
      description: product.description || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : (typeof product.tags === 'string' ? product.tags : ''),
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || form.price === '') return toast.error('Title, category, and price are required');
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deletingProduct._id}`);
      toast.success('Product deleted');
      setDeleteModalOpen(false);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-extrabold text-2xl tracking-tight font-headline-md">Products Catalog</h2>
          <p className="text-on-surface-variant text-sm mt-0.5 font-body-md">
            Manage your store inventory, stock status, and pricing
          </p>
        </div>
        <button
          id="add-product-btn"
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto hover:scale-102 active:scale-98 transition-transform"
        >
          <RiAddLine size={20} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 relative overflow-hidden">
        <div className="noise-overlay opacity-20" />
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-10 py-2.5 h-10"
              placeholder="Search products..."
            />
          </div>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="input h-10 py-0 px-3 min-w-[160px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            id="lowstock-filter"
            onClick={() => { setLowStockFilter(!lowStockFilter); setPage(1); }}
            className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all font-label-md ${
              lowStockFilter
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-glow-amber'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <RiFilterLine /> Low Stock
          </button>
          {(search || categoryFilter || lowStockFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setLowStockFilter(false); setPage(1); }}
              className="flex items-center gap-1 px-3 h-10 text-white/40 hover:text-white text-sm transition-colors font-label-md"
            >
              <RiCloseLine /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden relative">
        <div className="noise-overlay opacity-20" />
        <div className="table-container relative z-10">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-0 border-0">
                    <LoadingSkeleton rows={8} />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/30">
                    <RiShoppingBagLine className="text-4xl mx-auto mb-3 opacity-30" />
                    <p className="font-body-md">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover bg-white/5 border border-white/10 flex-shrink-0"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <RiImageLine className="text-white/20" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium text-sm max-w-[240px] truncate">{p.title}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(Array.isArray(p.tags) ? p.tags : []).slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="inline-block text-[10px] font-mono bg-white/5 border border-white/10 rounded-md px-1.5 py-0.5 text-white/50"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{p.category}</span>
                    </td>
                    <td>
                      <span className="text-white font-semibold font-mono">${p.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <span
                        className={`font-semibold font-mono ${
                          p.stock === 0 ? 'text-error' : p.stock < 10 ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      {p.stock === 0 ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : p.stock < 10 ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/20 text-primary-fixed-dim flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          title="Edit"
                        >
                          <RiEditLine size={15} />
                        </button>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="w-8 h-8 rounded-lg bg-error-container/20 hover:bg-error-container/30 border border-error-container/30 text-error flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          title="Delete"
                        >
                          <RiDeleteBinLine size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 relative z-10">
            <span className="text-on-surface-variant text-sm font-mono">
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                Prev
              </button>
              <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
                className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                placeholder="Product title"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input h-[46px] py-0 px-3"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Price ($) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Image URL
              </label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="input"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input resize-none"
                rows={3}
                placeholder="Product description..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider font-label-md">
                Tags (comma separated)
              </label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? (
                <>
                  <div className="w-4 h-4 spinner" />
                  Saving...
                </>
              ) : editingProduct ? (
                'Save Changes'
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-error-container/20 border border-error/30 flex items-center justify-center mx-auto shadow-glow-red">
            <RiDeleteBinLine className="text-error text-2xl" />
          </div>
          <div>
            <p className="text-white font-semibold text-lg font-headline-md">Are you sure?</p>
            <p className="text-on-surface-variant text-sm mt-1 font-body-md">
              This will permanently delete <span className="text-white font-medium">"{deletingProduct?.title}"</span>. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleDelete} className="btn-danger flex-1">
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
