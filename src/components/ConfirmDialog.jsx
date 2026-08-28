// مكوّن: نافذة تأكيد منبثقة (Modal) بدل window.confirm
export default function ConfirmDialog({
  open,
  title = 'تأكيد',
  message = '',
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50"
      onClick={busy ? undefined : onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm bg-white border-2 border-black shadow-[8px_8px_0px_#000] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-black tracking-tight">{title}</h3>
        {message ? <p className="mt-3 text-sm font-bold text-neutral-600 leading-relaxed">{message}</p> : null}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 text-sm font-black uppercase tracking-widest py-3 border-2 border-black transition-all ${
              danger
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#e4f542] text-black hover:bg-[#d6e72c]'
            } ${busy ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-[4px_4px_0px_#000] hover:-translate-y-0.5'}`}
          >
            {busy ? 'جارٍ التنفيذ…' : confirmText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="flex-1 text-sm font-black uppercase tracking-widest py-3 border-2 border-black bg-white text-black hover:bg-neutral-100 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
