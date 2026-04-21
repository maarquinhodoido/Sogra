import { deleteTestimonialAction, saveTestimonialAction } from "@/app/actions/admin";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getAdminTestimonialsData } from "@/lib/admin-data";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonialsData();

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Testemunhos"
        description="Adicione, aprove e destaque avaliações de clientes na homepage e na página dedicada."
      />
      <div className="grid gap-6 2xl:grid-cols-2">
        {testimonials.map((testimonial) => (
          <form key={testimonial.id} action={saveTestimonialAction} className="section-card space-y-4 rounded-[2rem] p-6">
            <input type="hidden" name="id" value={testimonial.id} />
            <div className="grid gap-4 md:grid-cols-2">
              <input name="clientName" defaultValue={testimonial.clientName} placeholder="Cliente" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="serviceName" defaultValue={testimonial.serviceName ?? ""} placeholder="Serviço" className="rounded-2xl border border-line bg-white px-4 py-3" />
              <input name="rating" defaultValue={testimonial.rating} type="number" min="1" max="5" className="rounded-2xl border border-line bg-white px-4 py-3" />
            </div>
            <textarea name="comment" defaultValue={testimonial.comment} rows={5} className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <label className="flex items-center gap-2"><input name="isApproved" type="checkbox" defaultChecked={testimonial.isApproved ?? false} /> Aprovado</label>
              <label className="flex items-center gap-2"><input name="isFeatured" type="checkbox" defaultChecked={testimonial.isFeatured ?? false} /> Destaque home</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Guardar</button>
              <button formAction={deleteTestimonialAction} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">Apagar</button>
            </div>
          </form>
        ))}
        <form action={saveTestimonialAction} className="section-card space-y-4 rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-foreground">Novo testemunho</h2>
          <input name="clientName" placeholder="Cliente" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <textarea name="comment" rows={5} placeholder="Comentário" className="w-full rounded-2xl border border-line bg-white px-4 py-3" />
          <div className="grid gap-4 md:grid-cols-2">
            <input name="serviceName" placeholder="Serviço" className="rounded-2xl border border-line bg-white px-4 py-3" />
            <input name="rating" type="number" min="1" max="5" defaultValue="5" className="rounded-2xl border border-line bg-white px-4 py-3" />
          </div>
          <button type="submit" className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white">Criar testemunho</button>
        </form>
      </div>
    </div>
  );
}
