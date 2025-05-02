
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/main-layout";
import { VideoGuide } from "@/components/documentation/video-guide";
import { UserGuide } from "@/components/documentation/user-guide";
import { VendorGuide } from "@/components/documentation/vendor-guide";
import { HowItWorksGuide } from "@/components/documentation/how-it-works";
import { FAQSection } from "@/components/documentation/faq-section";
import { SupportSection } from "@/components/documentation/support-section";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

// Valid tab types
type TabValue = "how-it-works" | "video" | "user-guide" | "vendor-guide" | "faq" | "support";

export default function DocumentationPage() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabValue>("how-it-works");
  
  // Set the initial tab based on URL query parameter
  useEffect(() => {
    if (location.includes("?tab=")) {
      try {
        const urlParams = new URLSearchParams(location.split("?")[1]);
        const tabFromUrl = urlParams.get("tab");
        
        if (tabFromUrl && isValidTab(tabFromUrl)) {
          setActiveTab(tabFromUrl as TabValue);
        }
      } catch (error) {
        console.error("Error parsing URL params:", error);
      }
    }
  }, [location]);
  
  // Type guard to check if the tab value is valid
  function isValidTab(tab: string): tab is TabValue {
    return ["how-it-works", "video", "user-guide", "vendor-guide", "faq", "support"].includes(tab);
  }

  const handleTabChange = (value: string) => {
    if (isValidTab(value)) {
      setActiveTab(value);
      // Update URL without navigating
      const newUrl = `/documentation?tab=${value}`;
      window.history.pushState({}, "", newUrl);
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">UniMart Documentation</h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Everything you need to know about using UniMart - from getting started to advanced features
            </p>
          </div>
          
          <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <div className="px-4 pt-4 bg-muted/30">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
                  <TabsTrigger 
                    value="how-it-works" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    How It Works
                  </TabsTrigger>
                  <TabsTrigger 
                    value="video" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Video Guides
                  </TabsTrigger>
                  <TabsTrigger 
                    value="user-guide" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Customer Guide
                  </TabsTrigger>
                  <TabsTrigger 
                    value="vendor-guide" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Vendor Guide
                  </TabsTrigger>
                  <TabsTrigger 
                    value="faq" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger 
                    value="support" 
                    className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Support
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="bg-background">
                <TabsContent value="how-it-works">
                  <div className="px-1">
                    <HowItWorksGuide />
                  </div>
                </TabsContent>
                <TabsContent value="video">
                  <div className="px-1">
                    <VideoGuide />
                  </div>
                </TabsContent>
                <TabsContent value="user-guide">
                  <div className="px-1">
                    <UserGuide />
                  </div>
                </TabsContent>
                <TabsContent value="vendor-guide">
                  <div className="px-1">
                    <VendorGuide />
                  </div>
                </TabsContent>
                <TabsContent value="faq">
                  <div className="px-1">
                    <FAQSection />
                  </div>
                </TabsContent>
                <TabsContent value="support">
                  <div className="px-1">
                    <SupportSection />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
