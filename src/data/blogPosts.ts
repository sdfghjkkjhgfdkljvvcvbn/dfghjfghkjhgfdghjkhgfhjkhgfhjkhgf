export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  date: string;
  readTime: string;
  coverImage: string;
}

export const posts: BlogPost[] = [
  {
    id: "signs-home-needs-refresh",
    title: "5 Signs Your Home Interior Needs a Refresh",
    excerpt: "From worn-out cabinets to awkward layouts, here's how to tell it's time to call in the design team.",
    content: [
      "A home doesn't need to look outdated to be due for a refresh. Some of the clearest signs are functional, not just visual: cabinets that stick, storage that never feels like enough, or a living room layout that hasn't kept up with how your family actually uses the space.",
      "Watch for peeling laminate, water stains near sinks and windows, and lighting that leaves parts of a room dim no matter how many lamps you add. Each of these usually points to a fixable design or material problem rather than something you have to live with.",
      "Before any renovation, we start with a site visit and measurement so recommendations are based on your actual layout, not guesswork. That's often the difference between a redesign that feels transformative and one that just moves the same problems around.",
    ],
    category: "Design Tips",
    date: "2026-06-02",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "what-is-wpc",
    title: "What Is WPC, and Why We Recommend It for Nepali Homes",
    excerpt: "Wood Plastic Composite explained: what it is, where it works best, and why it holds up so well locally.",
    content: [
      "WPC (Wood Plastic Composite) blends wood fiber with plastic polymers to create a panel material that looks like timber but behaves very differently in real conditions. It doesn't absorb moisture the way natural wood does, which matters a lot during Kathmandu Valley's monsoon months.",
      "In practice, that means no warping, no termite damage, and no swelling around bathrooms, kitchens, and exterior-facing walls. It's also flame-retardant, which makes it a sensible choice for ceiling grids and commercial wall cladding where fire safety codes apply.",
      "We typically recommend WPC for wall paneling, false ceilings, and exterior facades, while reserving solid wood for furniture pieces where the natural grain and finish matter most. Used in the right place, each material does its job well.",
    ],
    category: "Materials & WPC",
    date: "2026-05-18",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "inside-our-workshop",
    title: "Inside Our Kathmandu Workshop: How We Build Custom Furniture",
    excerpt: "A look at how a piece of furniture goes from a design file to a finished, delivered product.",
    content: [
      "Every custom furniture order starts on paper: dimensions confirmed on-site, material chosen against the client's budget, and a joinery plan drawn up before a single cut is made. Getting this stage right avoids nearly every problem that would otherwise show up during installation.",
      "From there, our in-house woodworking and metal-welding teams work in parallel: frames are cut and welded while panels are finished and sealed. Because everything happens under one roof, we can adjust a detail mid-build without waiting on an outside vendor.",
      "The last stage is always the least glamorous and most important: sanding, finish coats, and a hardware check, piece by piece, before anything leaves the workshop for site assembly.",
    ],
    category: "Behind The Scenes",
    date: "2026-04-27",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "vr-walkthrough-launch",
    title: "VR Walkthroughs: See Your Interior Before It's Built",
    excerpt: "We now offer immersive VR previews so you can walk through your design before construction begins.",
    content: [
      "One of the hardest parts of any interior project is judging scale and finish from a flat rendering on a screen. We've started offering VR walkthroughs to close that gap: once your 3D design is approved, you can put on a headset and walk through a room-scale version of your own home or office.",
      "It's the same layout, the same materials, and the same lighting plan, just experienced at true size instead of on a monitor. Clients use these sessions to compare finish options, double-check furniture placement, and catch anything that feels off before it's built into the budget.",
      "The sessions are available at our Kathmandu studio, or on-site with our own VR headset for larger commercial projects. If you're planning a renovation or new fit-out, ask about a VR preview when you book your free consultation.",
    ],
    category: "Technology",
    date: "2026-07-10",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "modular-kitchen-maintenance",
    title: "Modular Kitchen Maintenance: A Simple Seasonal Checklist",
    excerpt: "Keep your cabinets, hardware, and countertops looking new with a few habits each season.",
    content: [
      "Modular kitchens are built to last, but a few simple habits go a long way toward keeping them looking new. Wipe high-gloss and acrylic shutters with a soft, dry cloth rather than abrasive scrubbers, which can dull the finish over time.",
      "Check hinges and drawer channels every few months and tighten anything that's come loose from daily use. It's a five-minute job that prevents the sagging doors and sticky drawers that are the most common complaints we hear.",
      "Before monsoon season, inspect the sealant around your sink and countertop edges. Re-sealing a small gap is a quick fix; letting water sit in it for a season is what actually damages the cabinet underneath.",
    ],
    category: "Maintenance",
    date: "2026-03-15",
    readTime: "3 min read",
    coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "150-projects-note",
    title: "150+ Projects and Counting: A Note From Our Team",
    excerpt: "A short reflection on eight years of building homes, kitchens, and offices across the Kathmandu Valley.",
    content: [
      "When we started Parbati Interior, our goal was simple: measure carefully, plan clearly, and build things that hold up. Eight years and over 150 projects later, that's still the standard we hold ourselves to, whether the job is a single kitchen or a full commercial fit-out.",
      "The projects that stay with us most aren't always the biggest ones. They're the ones where a family finally got the storage they needed, or an office reopened on schedule after a tight turnaround.",
      "Thank you to everyone who has trusted us with their space so far. If you're planning a project, we'd love to start with a free site visit and measurement.",
    ],
    category: "Company News",
    date: "2026-01-20",
    readTime: "3 min read",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
];

export const categories = ["All", "Design Tips", "Materials & WPC", "Behind The Scenes", "Technology", "Maintenance", "Company News"];
