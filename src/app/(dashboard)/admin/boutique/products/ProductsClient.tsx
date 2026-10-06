"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { BoutiqueIcon, SafetyShieldIcon, ImageIcon, TrashIcon, EditIcon, EyeIcon, EyeOffIcon, StarIcon, StarOffIcon, LoaderIcon, SearchIcon, FilterIcon, PlusIcon, XIcon, CheckIcon, ChevronDownIcon } from "@/components/icons/HseIcons";

interface ProductCategory {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
}

import { Decimal } from "@prisma/client/runtime/library";

interface Product {
  id: string;
  titleFr: string;
  titleAr: string;
  slug: string;
  categoryId: string;
  shortDescFr: string | null;
  shortDescAr: string | null;
  descriptionFr: string | null;
  descriptionAr: string | null;
  images: string[];
  price: Decimal | number | null;
  stockStatus: string;
  certifications: string[];
  specifications: Record<string, string>;
  sku: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  order: number;
  category: ProductCategory;
  _count: { quoteItems: number };
}

interface ProductsClientProps {
  products: Product[];
  categories: ProductCategory[];
}

type ProductFormData = {
  titleFr: string;
  titleAr: string;
  slug: string;
  categoryId: string;
  shortDescFr: string;
  shortDescAr: string;
  descriptionFr: string;
  descriptionAr: string;
  images: string[];
  price: string;
  stockStatus: string;
  certifications: string;
  specifications: Record<string, string>;
  sku: string;
  isVisible: boolean;
  isFeatured: boolean;
  order: string;
};

const stockStatusOptions = [
  { value: "in_stock", labelKey: "stockInStock" },
  { value: "on_order", labelKey: "stockOnOrder" },
  { value: "out_of_stock", labelKey: "stockOutOfStock" },
];

export function ProductsClient({ products: initialProducts, categories }: ProductsClientProps) {
  const { t, locale } = useI18n();
  const isRtl = locale === "ar";

  // State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(initialProducts.length);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    titleFr: "",
    titleAr: "",
    slug: "",
    categoryId: "",
    shortDescFr: "",
    shortDescAr: "",
    descriptionFr: "",
    descriptionAr: "",
    images: [],
    price: "",
    stockStatus: "in_stock",
    certifications: "",
    specifications: {},
    sku: "",
    isVisible: true,
    isFeatured: false,
    order: "0",
  });

  // Toast state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryFilter) params.set("categoryId", categoryFilter);
      if (visibilityFilter !== "all") params.set("isVisible", visibilityFilter);
      if (stockFilter) params.set("stockStatus", stockFilter);

      const res = await fetch(`/api/admin/boutique/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, categoryFilter, visibilityFilter, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle form changes
  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const removeSpec = (key: string) => {
    setFormData((prev) => {
      const { [key]: _, ...rest } = prev.specifications;
      return { ...prev, specifications: rest };
    });
  };

  // Open create modal
  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      titleFr: "",
      titleAr: "",
      slug: "",
      categoryId: categories[0]?.id || "",
      shortDescFr: "",
      shortDescAr: "",
      descriptionFr: "",
      descriptionAr: "",
      images: [],
      price: "",
      stockStatus: "in_stock",
      certifications: "",
      specifications: {},
      sku: "",
      isVisible: true,
      isFeatured: false,
      order: "0",
    });
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      titleFr: product.titleFr,
      titleAr: product.titleAr,
      slug: product.slug,
      categoryId: product.categoryId,
      shortDescFr: product.shortDescFr || "",
      shortDescAr: product.shortDescAr || "",
      descriptionFr: product.descriptionFr || "",
      descriptionAr: product.descriptionAr || "",
      images: product.images,
      price: product.price?.toString() || "",
      stockStatus: product.stockStatus,
      certifications: product.certifications.join(", "),
      specifications: product.specifications,
      sku: product.sku || "",
      isVisible: product.isVisible,
      isFeatured: product.isFeatured,
      order: product.order.toString(),
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  // Upload images
  const handleUploadImages = async (files: File[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const res = await fetch("/api/admin/boutique/products/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return data.url;
      } else {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Handle file input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 5 || formData.images.length + files.length > 5) {
      setToast({ type: "error", message: "Maximum 5 images allowed" });
      return;
    }

    for (const file of files) {
      try {
        const url = await handleUploadImages([file]);
        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      } catch {
        setToast({ type: "error", message: `Failed to upload ${file.name}` });
      }
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Set cover image (move to first position)
  const setCover = (index: number) => {
    setFormData((prev) => {
      const images = [...prev.images];
      const [cover] = images.splice(index, 1);
      return { ...prev, images: [cover, ...images] };
    });
  };

  // Save product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const certifications = formData.certifications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        order: parseInt(formData.order) || 0,
        certifications,
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/boutique/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/boutique/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setToast({ type: "success", message: t.admin.productSaved });
        setShowModal(false);
        fetchProducts();
      } else {
        const error = await res.json();
        throw new Error(error.error || t.admin.productSaveError);
      }
    } catch (err) {
      setToast({ type: "error", message: t.admin.productSaveError });
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm(t.admin.confirmDeleteProductMessage)) return;

    try {
      const res = await fetch(`/api/admin/boutique/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setToast({ type: "success", message: t.admin.productDeleted });
        fetchProducts();
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete product" });
    }
  };

  // Get status badge
  const getStockBadge = (status: string) => {
    const option = stockStatusOptions.find((s) => s.value === status);
    const label = option ? t.admin[option.labelKey as keyof typeof t.admin] : status;
    const colors: Record<string, string> = {
      in_stock: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      on_order: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      out_of_stock: "bg-red-500/10 text-red-400 border-red-500/30",
    };
    return (
      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${colors[status] || colors.in_stock}`}>
        {label}
      </span>
    );
  };

  const getVisibilityBadge = (visible: boolean) => (
    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
      visible ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-500/10 text-slate-400 border-slate-500/30"
    }`}>
      {visible ? t.admin.visible : t.admin.hidden}
    </span>
  );

  if (loading && products.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
              <BoutiqueIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-white uppercase">{t.admin.productsTitle}</h1>
          </div>
        </header>
        <div className="flex items-center justify-center h-64">
          <LoaderIcon className="w-8 h-8 text-[#FDCD1A] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FDCD1A] text-[#0A0A0A]">
              <BoutiqueIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white uppercase">{t.admin.productsTitle}</h1>
              <p className="text-sm text-slate-400">{t.admin.productsDesc}</p>
            </div>
          </div>
          <button
            onClick={handleNewProduct}
            className="flex items-center gap-2 rounded-full bg-[#FDCD1A] px-5 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>{t.admin.newProduct}</span>
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/50 p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.admin.searchProducts}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-600 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
            >
              <option value="">{t.admin.allCategories}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {locale === "ar" ? cat.titleAr : cat.titleFr}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
            >
              <option value="all">{t.admin.allVisibilities}</option>
              <option value="true">{t.admin.visible}</option>
              <option value="false">{t.admin.hidden}</option>
            </select>
          </div>
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
            >
              <option value="">{t.admin.allStockStatuses}</option>
              {stockStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t.admin[opt.labelKey as keyof typeof t.admin]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
          <ImageIcon className="mx-auto h-16 w-16 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{t.admin.noProducts}</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {debouncedSearch || categoryFilter || visibilityFilter !== "all" || stockFilter
              ? (isRtl ? "لا توجد منتجات تطابق معايير البحث" : "Aucun produit ne correspond aux filtres")
              : (isRtl ? "أضف أول منتج لبدء الكتالوج" : "Ajoutez votre premier produit pour démarrer le catalogue")}
          </p>
          {!debouncedSearch && categoryFilter === "" && visibilityFilter === "all" && stockFilter === "" && (
            <button
              onClick={handleNewProduct}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FDCD1A] px-6 py-2.5 text-sm font-bold text-[#0A0A0A] hover:bg-[#e5b917] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{t.admin.newProduct}</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-slate-700 transition-all"
              >
                {/* Image */}
                <div className="aspect-square relative bg-slate-800">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={locale === "ar" ? product.titleAr : product.titleFr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.isFeatured && (
                      <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        <StarIcon className="inline w-3 h-3 mr-1" /> {t.admin.featured}
                      </span>
                    )}
                    {!product.isVisible && (
                      <span className="rounded-full bg-slate-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
                        <EyeOffIcon className="inline w-3 h-3 mr-1" /> {t.admin.hidden}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-white line-clamp-1 flex-1 min-w-0">
                      {locale === "ar" ? product.titleAr : product.titleFr}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">
                    {locale === "ar" ? product.category.titleAr : product.category.titleFr}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    {getStockBadge(product.stockStatus)}
                    {getVisibilityBadge(product.isVisible)}
                  </div>

                  {product.price && (
                    <p className="text-lg font-bold text-[#FDCD1A] mb-3">
                      {product.price.toLocaleString()} MAD
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-500">
                      {product._count.quoteItems} {isRtl ? "طلب عرض" : "devis"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title={t.admin.editProduct}
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title={t.admin.deleteProduct}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDownIcon className="w-5 h-5 transform rotate-90" />
              </button>
              <span className="text-sm text-slate-400">
                {t.admin.paginationShowing} {((page - 1) * 20) + 1} {t.admin.paginationTo} {Math.min(page * 20, total)} {t.admin.paginationOf} {total}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= total}
                className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDownIcon className="w-5 h-5 transform -rotate-90" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/95 backdrop-blur z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? t.admin.editProduct : t.admin.newProduct}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {toast && (
                <div
                  className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 ${
                    toast.type === "success"
                      ? "bg-green-900/90 border border-green-700 text-green-300"
                      : "bg-red-900/90 border border-red-700 text-red-300"
                  } animate-in slide-in-from-bottom-4`}
                  role="alert"
                >
                  {toast.type === "success" ? (
                    <CheckIcon className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <XIcon className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span>{toast.message}</span>
                </div>
              )}

              {/* Basic Info */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <SafetyShieldIcon className="w-5 h-5 text-[#FDCD1A]" />
                  Informations de base
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">
                      {t.admin.productNameFr} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.titleFr}
                      onChange={(e) => handleChange("titleFr", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">
                      {t.admin.productNameAr} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.titleAr}
                      onChange={(e) => handleChange("titleAr", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productSlug}</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productCategory} <span className="text-red-500">*</span></label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleChange("categoryId", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {locale === "ar" ? cat.titleAr : cat.titleFr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Descriptions */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <SafetyShieldIcon className="w-5 h-5 text-[#FDCD1A]" />
                  Descriptions
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productShortDescFr}</label>
                    <textarea
                      value={formData.shortDescFr}
                      onChange={(e) => handleChange("shortDescFr", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productShortDescAr}</label>
                    <textarea
                      value={formData.shortDescAr}
                      onChange={(e) => handleChange("shortDescAr", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productDescFr}</label>
                    <textarea
                      value={formData.descriptionFr}
                      onChange={(e) => handleChange("descriptionFr", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] resize-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productDescAr}</label>
                    <textarea
                      value={formData.descriptionAr}
                      onChange={(e) => handleChange("descriptionAr", e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A] resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Images */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#FDCD1A]" />
                  {t.admin.productImages} (max 5)
                </h3>
                <div className="grid gap-4 md:grid-cols-5">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-xl border border-slate-700 overflow-hidden">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setCover(index)}
                            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                            title={t.admin.setAsCover}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                          title={t.admin.removeImage}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-amber-500/90 text-white px-1.5 py-0.5 rounded">
                          <StarIcon className="inline w-3 h-3 mr-1" /> {t.admin.productCoverImage}
                        </span>
                      )}
                    </div>
                  ))}
                  {formData.images.length < 5 && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-700 cursor-pointer hover:border-[#FDCD1A] transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="text-sm font-medium">{t.admin.uploadImages}</span>
                        <p className="text-[11px] text-slate-600 mt-1">{t.admin.dragDropImages}</p>
                      </div>
                    </label>
                  )}
                </div>
              </section>

              {/* Certifications & Specifications */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <SafetyShieldIcon className="w-5 h-5 text-[#FDCD1A]" />
                  {t.admin.productCertifications} & {t.admin.productSpecifications}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productCertifications}</label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => handleChange("certifications", e.target.value)}
                      placeholder={t.admin.certificationsPlaceholder}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productSpecifications}</label>
                    <div className="space-y-2">
                      {Object.entries(formData.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={key}
                            onChange={(e) => handleSpecChange(key, e.target.value)}
                            placeholder={t.admin.specKeyPlaceholder}
                            className="flex-1 rounded-xl border border-slate-600 px-4 py-2 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleSpecChange(key, e.target.value)}
                            placeholder={t.admin.specValuePlaceholder}
                            className="flex-1 rounded-xl border border-slate-600 px-4 py-2 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpec(key)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSpecChange("", "")}
                        className="w-full py-2 text-sm font-medium text-[#FDCD1A] hover:text-[#e5b917] transition-colors flex items-center justify-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span>{t.admin.addSpecification}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Advanced */}
              <section>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <SafetyShieldIcon className="w-5 h-5 text-[#FDCD1A]" />
                  Options avancées
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productSku}</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productPrice} (MAD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                      placeholder={t.admin.productPriceOnQuote}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productOrder}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => handleChange("order", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white placeholder-slate-500 focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={(e) => handleChange("isVisible", e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600 text-[#FDCD1A] focus:ring-[#FDCD1A]"
                      />
                      <span className="text-sm text-slate-300">{t.admin.productVisible}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleChange("isFeatured", e.target.checked)}
                        className="w-4 h-4 rounded border-slate-600 text-[#FDCD1A] focus:ring-[#FDCD1A]"
                      />
                      <span className="text-sm text-slate-300">{t.admin.productFeatured}</span>
                    </label>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-slate-300">{t.admin.productStockStatus}</label>
                    <select
                      value={formData.stockStatus}
                      onChange={(e) => handleChange("stockStatus", e.target.value)}
                      className="w-full rounded-xl border border-slate-600 px-4 py-3 bg-slate-800 text-white focus:border-[#FDCD1A] focus:outline-none focus:ring-1 focus:ring-[#FDCD1A]"
                    >
                      {stockStatusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {t.admin[opt.labelKey as keyof typeof t.admin]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-slate-800 pt-4 pb-6 bg-slate-900/95 backdrop-blur rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#073022] px-6 py-3 text-sm font-bold text-white hover:bg-[#094530] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                      <span>{t.admin.savingProduct}</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      <span>{t.common.save}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}