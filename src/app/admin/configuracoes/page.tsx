import { saveSiteSettingsAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminSettingsData } from "@/lib/admin-data";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettingsData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Configurações"
        description="Branding, contactos, SEO, redes sociais, consentimento e parâmetros de marcação."
      />
      <form action={saveSiteSettingsAction} className="section-card space-y-6 rounded-[2rem] p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="businessName" defaultValue={settings.businessName} placeholder="Nome do negócio" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="tagline" defaultValue={settings.tagline} placeholder="Tagline" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="businessEmail" defaultValue={settings.businessEmail} placeholder="Email geral" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="bookingEmail" defaultValue={settings.bookingEmail} placeholder="Email marcações" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="phone" defaultValue={settings.phone} placeholder="Telefone" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="whatsapp" defaultValue={settings.whatsapp} placeholder="WhatsApp" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="address" defaultValue={settings.address} placeholder="Morada" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
          <input name="city" defaultValue={settings.city} placeholder="Cidade" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="postalCode" defaultValue={settings.postalCode} placeholder="Código postal" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="googleMapsUrl" defaultValue={settings.googleMapsUrl} placeholder="Google Maps" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
          <input name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} placeholder="Instagram" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="facebookUrl" defaultValue={settings.facebookUrl ?? ""} placeholder="Facebook" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="tiktokUrl" defaultValue={settings.tiktokUrl ?? ""} placeholder="TikTok" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
          <input name="heroImageUrl" defaultValue={settings.heroImageUrl ?? ""} placeholder="Imagem hero" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="logoUrl" defaultValue={settings.logoUrl ?? ""} placeholder="Logo" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="faviconUrl" defaultValue={settings.faviconUrl ?? ""} placeholder="Favicon" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
          <input name="bookingBufferMinutes" defaultValue={settings.bookingBufferMinutes} type="number" placeholder="Buffer" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="maxAppointmentsPerDay" defaultValue={settings.maxAppointmentsPerDay} type="number" placeholder="Máx/dia" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="depositAmount" defaultValue={settings.depositAmount ?? 0} type="number" step="0.01" placeholder="Valor do sinal" className="rounded-2xl border border-line bg-white px-4 py-3" />
          <input name="metaTitle" defaultValue={settings.metaTitle} placeholder="Meta title" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
          <input name="metaKeywords" defaultValue={settings.metaKeywords} placeholder="Keywords" className="rounded-2xl border border-line bg-white px-4 py-3 md:col-span-2" />
        </div>
        <textarea name="metaDescription" defaultValue={settings.metaDescription} rows={4} placeholder="Meta description" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
        <textarea name="consentLabel" defaultValue={settings.consentLabel} rows={4} placeholder="Texto de consentimento" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <label className="flex items-center gap-2"><input name="allowDeposits" type="checkbox" defaultChecked={settings.allowDeposits} /> Ativar sinal</label>
          <label className="flex items-center gap-2"><input name="loyaltyEnabled" type="checkbox" defaultChecked={settings.loyaltyEnabled} /> Fidelização</label>
          <label className="flex items-center gap-2"><input name="couponsEnabled" type="checkbox" defaultChecked={settings.couponsEnabled} /> Cupões</label>
        </div>
        <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white">Guardar configurações</button>
      </form>
    </div>
  );
}
