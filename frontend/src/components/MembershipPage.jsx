import React, { useMemo, useState } from 'react';
import { CalendarCheck, Check, Crown, MessageCircle, Phone, Scissors, Star } from 'lucide-react';
import {
  foundingMembersOffer,
  membershipBenefits,
  membershipPlans
} from '../data/services';

const phoneNumber = '+264 81 474 8665';
const whatsappNumber = '264814748665';

const planOptions = [
  {
    id: foundingMembersOffer.id,
    name: foundingMembersOffer.name,
    price: foundingMembersOffer.price,
    cadence: foundingMembersOffer.cadence,
    tagline: foundingMembersOffer.description,
    bestFor: `Only ${foundingMembersOffer.limit} slots available`,
    featured: true,
    features: [
      'Lock in N$599/month forever',
      'Available to the first 50 members',
      'Includes core membership benefits'
    ]
  },
  ...membershipPlans
];

const initialForm = {
  name: '',
  phone: '',
  planId: foundingMembersOffer.id,
  notes: ''
};

const MembershipPage = ({ setCurrentPage }) => {
  const [form, setForm] = useState(initialForm);
  const [notice, setNotice] = useState(null);

  const selectedPlan = useMemo(
    () => planOptions.find((plan) => plan.id === form.planId) || planOptions[0],
    [form.planId]
  );

  const signupMessage = useMemo(() => {
    const lines = [
      'Hi Vintage Fades, I want to sign up for a monthly membership.',
      `Plan: ${selectedPlan.name} - N$${selectedPlan.price}/${selectedPlan.cadence}`,
      `Name: ${form.name || '[enter name]'}`,
      `Phone: ${form.phone || '[enter phone]'}`,
      form.notes ? `Notes: ${form.notes}` : ''
    ].filter(Boolean);

    return lines.join('\n');
  }, [form.name, form.notes, form.phone, selectedPlan]);

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(signupMessage)}`;

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setNotice(null);
  };

  const choosePlan = (planId) => {
    updateForm('planId', planId);
    document.getElementById('membership-signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setNotice({ type: 'error', message: 'Enter your full name to reserve a membership.' });
      return;
    }

    if (!form.phone.trim()) {
      setNotice({ type: 'error', message: 'Enter your phone number so the shop can confirm your membership.' });
      return;
    }

    setNotice({
      type: 'success',
      message: `Your ${selectedPlan.name} membership request is ready. Send it on WhatsApp to confirm your slot.`
    });
  };

  return (
    <main className="bg-stone-950 text-white">
      <section className="overflow-hidden border-b border-amber-400/20 bg-stone-950">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="mb-8 text-sm font-bold text-amber-300 transition hover:text-amber-200"
            >
              Back to Home
            </button>
            <p className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-3 py-2 text-sm font-black uppercase text-stone-950">
              <Crown size={16} />
              Monthly Membership Plans
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight sm:text-6xl">
              Look fresh every week without breaking the bank.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
              For the first time ever, Vintage Fades is offering monthly memberships for clients who take their appearance seriously.
              Lock in priority booking, weekly haircuts, exclusive benefits, and sharp all-month confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#membership-signup"
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-6 py-3 text-base font-black text-stone-950 transition hover:bg-amber-300"
              >
                <CalendarCheck size={18} />
                Sign Up Today
              </a>
              <button
                type="button"
                onClick={() => setCurrentPage('booking')}
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-6 py-3 text-base font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20"
              >
                <Scissors size={18} />
                Book a Cut
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-4 rounded-lg bg-amber-400/20 blur-3xl" />
            <img
              src="/membership-plans.png"
              alt="Vintage Fades monthly membership plans flyer"
              className="relative w-full rounded-lg border border-amber-400/40 bg-black object-cover shadow-2xl shadow-black/60"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase text-amber-700">Membership Benefits</p>
              <h2 className="mt-2 text-4xl font-black">Everything built around staying sharp</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-stone-600">
              Choose a plan, secure your monthly rate, and keep your grooming routine consistent with member-first support.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-400 text-stone-950">
                  <Check size={18} />
                </span>
                <p className="font-black">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-100 py-16 text-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase text-amber-700">Choose Your Plan</p>
            <h2 className="mt-2 text-4xl font-black">Membership tiers</h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {membershipPlans.map((plan) => (
              <article
                key={plan.id}
                className={`rounded-lg border p-6 shadow-sm ${
                  plan.featured
                    ? 'border-amber-400 bg-stone-950 text-white'
                    : 'border-stone-200 bg-white text-stone-950'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm font-black uppercase ${plan.featured ? 'text-amber-300' : 'text-amber-700'}`}>
                      {plan.bestFor}
                    </p>
                    <h3 className="mt-2 text-3xl font-black">{plan.name}</h3>
                  </div>
                  {plan.featured && (
                    <span className="rounded-md bg-amber-400 px-3 py-2 text-xs font-black uppercase text-stone-950">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="mt-5 text-5xl font-black">
                  N${plan.price}
                  <span className={`ml-2 text-base font-bold ${plan.featured ? 'text-stone-300' : 'text-stone-500'}`}>
                    /{plan.cadence}
                  </span>
                </p>
                <p className={`mt-4 text-sm leading-6 ${plan.featured ? 'text-stone-200' : 'text-stone-600'}`}>
                  {plan.tagline}
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm font-semibold">
                      <Check className={plan.featured ? 'text-amber-300' : 'text-amber-700'} size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => choosePlan(plan.id)}
                  className={`mt-8 w-full rounded-md px-5 py-3 text-sm font-black transition ${
                    plan.featured
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : 'bg-stone-950 text-white hover:bg-stone-800'
                  }`}
                >
                  Select {plan.name}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-amber-400/30 bg-amber-400 py-10 text-stone-950">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide">Founding Members Offer</p>
            <h2 className="mt-2 text-4xl font-black">First {foundingMembersOffer.limit} members: N${foundingMembersOffer.price}/month forever</h2>
            <p className="mt-3 max-w-3xl text-base font-semibold leading-7">
              Secure your membership early and lock in the founding rate before the first 50 slots are gone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => choosePlan(foundingMembersOffer.id)}
            className="rounded-md bg-stone-950 px-6 py-4 text-base font-black text-white transition hover:bg-stone-800"
          >
            Claim Founding Rate
          </button>
        </div>
      </section>

      <section id="membership-signup" className="bg-stone-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <form onSubmit={handleSubmit} className="rounded-lg border border-white/10 bg-white p-6 text-stone-950 shadow-2xl shadow-black/30 sm:p-8">
            <p className="text-sm font-black uppercase text-amber-700">Membership Sign Up</p>
            <h2 className="mt-2 text-4xl font-black">Reserve your plan</h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              Send your details to Vintage Fades and the shop will confirm your membership, payment, and slot availability.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-stone-700">Full name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-stone-700">Phone number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateForm('phone', event.target.value)}
                  className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  placeholder="+264 81 234 5678"
                  autoComplete="tel"
                />
              </label>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-stone-700">Select membership</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {planOptions.map((plan) => {
                  const isSelected = form.planId === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => updateForm('planId', plan.id)}
                      className={`rounded-lg border-2 p-4 text-left transition ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <span className="block text-base font-black">{plan.name}</span>
                      <span className="mt-1 block text-sm font-bold text-amber-700">N${plan.price}/{plan.cadence}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-6 block">
              <span className="text-sm font-bold text-stone-700">Notes</span>
              <textarea
                value={form.notes}
                onChange={(event) => updateForm('notes', event.target.value)}
                rows="4"
                className="mt-2 w-full resize-none rounded-md border border-stone-300 px-4 py-3 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                placeholder="Preferred days, questions, or anything the shop should know."
              />
            </label>

            {notice && (
              <p className={`mt-6 rounded-md px-4 py-3 text-sm font-bold ${
                notice.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {notice.message}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-md bg-stone-950 px-6 py-3 text-base font-black text-white transition hover:bg-stone-800"
              >
                Prepare Signup
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-400 px-6 py-3 text-base font-black text-stone-950 transition hover:bg-amber-300"
              >
                <MessageCircle size={18} />
                Send on WhatsApp
              </a>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="rounded-lg border border-amber-400/30 bg-white/10 p-6">
              <p className="text-sm font-black uppercase text-amber-300">Selected Plan</p>
              <h3 className="mt-2 text-3xl font-black">{selectedPlan.name}</h3>
              <p className="mt-3 text-5xl font-black text-amber-300">
                N${selectedPlan.price}
                <span className="ml-2 text-base text-stone-300">/{selectedPlan.cadence}</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-stone-200">{selectedPlan.tagline}</p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/10 p-6">
              <p className="flex items-center gap-2 text-sm font-black uppercase text-amber-300">
                <Star size={16} />
                Need help choosing?
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                Call or WhatsApp the shop and Vintage Fades will help you pick the right membership for your grooming routine.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-black text-stone-950 transition hover:bg-amber-300"
                >
                  <Phone size={17} />
                  Call
                </a>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-3 text-sm font-black text-white ring-1 ring-white/15 transition hover:bg-white/20"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default MembershipPage;
