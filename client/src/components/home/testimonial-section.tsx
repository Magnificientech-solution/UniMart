import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Customer",
    content: "I've been shopping here for months and the quality of products is consistently excellent. The checkout process is smooth and delivery is always on time.",
    rating: 5,
    avatar: "",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Customer",
    content: "The variety of products available is incredible. I can find everything I need in one place, and the prices are competitive too!",
    rating: 5,
    avatar: "",
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Vendor",
    content: "As a vendor, I've found this platform incredibly easy to use. The tools for managing my products and tracking sales are intuitive and powerful.",
    rating: 4,
    avatar: "",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    role: "Customer",
    content: "The customer service is exceptional. When I had an issue with my order, it was resolved quickly and professionally.",
    rating: 5,
    avatar: "",
  },
];

export function TestimonialSection() {
  // Testimonial background colors (alternating)
  const backgrounds = [
    "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40",
    "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
    "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40",
    "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40"
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background/60"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
            <span className="text-primary font-medium text-sm">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">What Our Customers Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Don't just take our word for it — hear from some of our satisfied customers and vendors about their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="group h-full"
            >
              <div className={`h-full overflow-hidden rounded-2xl border border-primary/10 shadow-lg transition-all duration-300 group-hover:shadow-xl ${backgrounds[index % backgrounds.length]}`}>
                <div className="p-6 flex flex-col h-full relative">
                  {/* Quote mark decoration */}
                  <div className="absolute -top-2 -left-2 text-6xl opacity-10 text-primary font-serif">
                    "
                  </div>
                  
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4 relative z-10">
                    {Array(5).fill(0).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating 
                            ? "text-amber-500 fill-amber-500" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <p className="text-base flex-grow relative z-10 font-medium">{testimonial.content}</p>
                  
                  {/* User info */}
                  <div className="flex items-center mt-6 pt-4 border-t border-primary/10 relative z-10">
                    <Avatar className="h-12 w-12 mr-4 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                      {testimonial.avatar ? (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-indigo-600/80 text-white">
                        {testimonial.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Decorative dots pattern */}
        <div className="hidden lg:block absolute bottom-10 right-10 opacity-20">
          <div className="grid grid-cols-3 gap-2">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
