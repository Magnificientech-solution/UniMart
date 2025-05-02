
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Mail, Phone, MessageCircle, Clock, MapPin, AlertCircle } from "lucide-react";

export function SupportSection() {
  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Contact UniMart Support</h2>
        <p className="text-muted-foreground text-lg">
          Our dedicated support team is here to help with any questions or issues you might have
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Email Support</CardTitle>
            <CardDescription>
              Get a response within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Email address:</span></p>
              <p className="text-primary font-medium">michael.omotayo@magnificentechsolution.co.uk</p>
              <p className="text-muted-foreground mt-2">
                Send us detailed information about your inquiry for faster assistance.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => window.location.href = `mailto:michael.omotayo@magnificentechsolution.co.uk?subject=UniMart Support Request`}
            >
              Send Email
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Phone Support</CardTitle>
            <CardDescription>
              Speak directly with our team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Phone number:</span></p>
              <p className="text-primary font-medium">07477573794</p>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <p>Available Monday-Friday, 9am-5pm UK time</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={() => window.location.href = `tel:07477573794`}
            >
              Call Support
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Live Chat</CardTitle>
            <CardDescription>
              Get immediate assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Response time:</span></p>
              <p className="text-primary font-medium">Usually within 5 minutes</p>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>For urgent issues or quick questions</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Start Chat
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 bg-card border-primary/10 shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold mb-2">Additional Support Resources</h3>
            <p className="text-muted-foreground mb-4">
              Get help with your queries through our comprehensive online resources
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-muted-foreground">Email & Chat: 24/7</p>
                  <p className="text-muted-foreground">Phone Support: Monday-Friday, 9am-5pm UK time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <AlertCircle className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Response Times</p>
                  <p className="text-muted-foreground">Email: Within 24 hours</p>
                  <p className="text-muted-foreground">Chat: Usually within 5 minutes</p>
                  <p className="text-muted-foreground">Phone: Immediate during support hours</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/3 bg-primary/5 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-center">Common Support Topics</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full text-primary">✓</span>
                Order tracking and delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full text-primary">✓</span>
                Returns and refunds
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full text-primary">✓</span>
                Vendor account setup
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 p-1 rounded-full text-primary">✓</span>
                Payment issues and verification
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
