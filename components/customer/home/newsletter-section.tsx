export function NewsletterSection() {
  return (
    <section className="my-6 rounded border border-[#d6ab30] bg-[linear-gradient(180deg,#fff8e7_0%,#fffdf7_100%)] p-5 sm:p-7">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b38716]">আমাদের নিউজলেটার</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            প্রতিদিন সকালে সেরা শিরোনাম পান ইনবক্সে
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            শিক্ষা, ক্যাম্পাস ও কর্মজীবনের গুরুত্বপূর্ণ সংবাদ প্রতিদিন সকাল ৮টায়।
          </p>
        </div>
        <form
          className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
          action="#"
          method="post"
        >
          <label htmlFor="nl-email" className="sr-only">
            ইমেইল ঠিকানা
          </label>
          <input
            id="nl-email"
            name="email"
            type="email"
            required
            placeholder="আপনার ইমেইল লিখুন"
            className="h-10 flex-1 rounded border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#c79a1d]"
          />
          <button
            type="submit"
            className="h-10 rounded bg-[#c79a1d] px-5 text-sm font-bold text-white transition-colors hover:bg-[#b38716]"
          >
            সাবস্ক্রাইব
          </button>
        </form>
      </div>
    </section>
  )
}
