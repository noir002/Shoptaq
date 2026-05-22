import { useEffect, useState, useCallback } from 'react';
import {
  RiAddLine, RiSearchLine, RiEditLine, RiDeleteBinLine,
  RiFilterLine, RiArchiveLine, RiCloseLine, RiImageLine,
  RiLayoutGridLine, RiListUnordered,
} from 'react-icons/ri';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import PageHeader from '../components/ui/PageHeader';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCT_TYPES, STOCK_STATUS } from '../constants/catalog';
import { toSku } from '../utils/sku';

const emptyForm = {
  title: '', category: '', productType: 'Physical', price: '', stock: '', image: '', description: '', tags: '',
};

const getStockBadge = (stock) => {
  if (stock === 0) return STOCK_STATUS.out;
  if (stock < 10) return STOCK_STATUS.low;
  return STOCK_STATUS.inStock;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [viewMode, setViewMode] = useState('table');
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
      setPages(data.pages);
    } catch {
      toast.error('Catalog could not be loaded');
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
      productType: product.productType || 'Physical',
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
    if (!form.title || !form.category || form.price === '') {
      return toast.error('Name, category, and unit price are required');
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      delete payload.productType;
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('SKU updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('SKU added to catalog');
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
      toast.success('SKU removed from catalog');
      setDeleteModalOpen(false);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const renderProductActions = (p) => (
    <div className="flex items-center gap-2">
      <button
        onClick={() => openEdit(p)}
        className="w-8 h-8 rounded-lg bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/20 text-primary-fixed-dim flex items-center justify-center transition-all"
        title="Edit SKU"
      >
        <RiEditLine size={15} />
      </button>
      <button
        onClick={() => confirmDelete(p)}
        className="w-8 h-8 rounded-lg bg-error-container/30 hover:bg-error-container/50 border border-error/20 text-error flex items-center justify-center transition-all"
        title="Remove SKU"
      >
        <RiDeleteBinLine size={15} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        badge="SKU Catalog"
        title="Inventory management"
        subtitle="Maintain product records, pricing, availability, and merchandising metadata for your retail operation."
        actions={
          <button id="add-product-btn" onClick={openCreate} className="btn-primary flex items-center gap-2">
            <RiAddLine size={20} /> New SKU
          </button>
        }
      />

      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              id="product-search"
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input pl-10 py-2.5 h-10"
              placeholder="Search by name, SKU, or tag…"
            />
          </div>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="input h-10 py-0 px-3 min-w-[180px]"
          >
            <option value="">All departments</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            id="lowstock-filter"
            onClick={() => { setLowStockFilter(!lowStockFilter); setPage(1); }}
            className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-all ${
              lowStockFilter
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-surface-raised border-outline/50 text-on-surface-variant hover:text-primary'
            }`}
          >
            <RiFilterLine /> Replenishment
          </button>
          <div className="view-toggle ml-auto">
            <button
              type="button"
              className={`view-toggle__btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <RiListUnordered className="inline mr-1" /> List
            </button>
            <button
              type="button"
              className={`view-toggle__btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <RiLayoutGridLine className="inline mr-1" /> Grid
            </button>
          </div>
          {(search || categoryFilter || lowStockFilter) && (
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setLowStockFilter(false); setPage(1); }}
              className="flex items-center gap-1 px-3 h-10 text-on-surface-variant hover:text-on-surface text-sm"
            >
              <RiCloseLine /> Reset
            </button>
          )}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="card p-4 space-y-3 animate-pulse">
                <div className="skeleton h-32 rounded-xl w-full" />
                <div className="skeleton h-4 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full card p-12 text-center text-on-surface-variant">
              <RiArchiveLine className="text-4xl mx-auto mb-3 opacity-30" />
              <p>No SKUs match your filters</p>
            </div>
          ) : (
            products.map((p) => {
              const status = getStockBadge(p.stock);
              return (
                <div key={p._id} className="product-card">
                  <div className="h-36 rounded-xl bg-surface-muted/50 border border-outline/40 overflow-hidden flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <RiImageLine className="text-3xl text-on-surface-variant/40" />
                    )}
                  </div>
                  <div>
                    <p className="sku-mono">{toSku(p.title)}</p>
                    <h4 className="text-on-surface font-semibold text-sm mt-1 line-clamp-2">{p.title}</h4>
                    <span className="badge badge-info text-[10px] mt-2">{p.category}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline/40">
                    <div>
                      <p className="text-on-surface font-bold font-mono">${p.price.toFixed(2)}</p>
                      <p className="text-on-surface-variant text-xs">{p.stock} in stock</p>
                    </div>
                    <span className={`badge text-[10px] ${status.className}`}>{status.label}</span>
                  </div>
                  <div className="flex justify-end">{renderProductActions(p)}</div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="section-panel">
          <div className="table-container border-0 rounded-none shadow-none">
            <table className="table">
              <thead>
                <tr>
                  <th>SKU / Product</th>
                  <th>Department</th>
                  <th>Unit Price</th>
                  <th>On Hand</th>
                  <th>Availability</th>
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
                    <td colSpan={6} className="text-center py-16 text-on-surface-variant">
                      <RiArchiveLine className="text-4xl mx-auto mb-3 opacity-30" />
                      <p>No SKUs match your filters</p>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const status = getStockBadge(p.stock);
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg bg-surface-muted/50 border border-outline/40 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {p.image ? (
                                <img src={p.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <RiImageLine className="text-on-surface-variant" />
                              )}
                            </div>
                            <div>
                              <p className="text-on-surface font-medium text-sm max-w-[220px] truncate">{p.title}</p>
                              <p className="sku-mono mt-0.5">{toSku(p.title)}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-purple text-[10px]">{p.category}</span></td>
                        <td><span className="font-mono font-semibold text-on-surface">${p.price.toFixed(2)}</span></td>
                        <td>
                          <span className={`font-mono font-semibold ${p.stock === 0 ? 'text-error' : p.stock < 10 ? 'text-amber-600' : 'text-on-surface'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td><span className={`badge text-[10px] ${status.className}`}>{status.label}</span></td>
                        <td><div className="flex items-center justify-end">{renderProductActions(p)}</div></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant text-sm font-mono">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30">Previous</button>
            <button disabled={page === pages} onClick={() => setPage(page + 1)} className="btn-secondary py-1.5 px-3 text-sm disabled:opacity-30">Next</button>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit SKU' : 'Register new SKU'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Product name *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="e.g. Meridian Performance Blazer" required />
              {form.title && <p className="sku-mono mt-1.5">Preview: {toSku(form.title)}</p>}
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Department *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input h-[46px] py-0 px-3" required>
                <option value="">Select department</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Listing type</label>
              <select value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} className="input h-[46px] py-0 px-3">
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Unit price ($) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Quantity on hand</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Asset URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://…" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Merchandising description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" rows={3} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-on-surface-variant text-xs font-semibold mb-1.5 uppercase tracking-wider">Search tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input" placeholder="premium, seasonal, bestseller" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <><div className="w-4 h-4 spinner" />Saving…</> : editingProduct ? 'Update SKU' : 'Publish SKU'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Remove SKU" size="sm">
        <div className="text-center space-y-4">
          <p className="text-on-surface font-semibold">Confirm removal</p>
          <p className="text-on-surface-variant text-sm">
            <span className="text-on-surface font-medium">{deletingProduct?.title}</span> will be permanently removed from your catalog.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleDelete} className="btn-danger flex-1">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;
