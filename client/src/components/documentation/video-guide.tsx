
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Package, Star, Smartphone, CreditCard, Truck, ShieldCheck, 
  BarChart, Play, Pause, RefreshCw, Film, Loader2, CheckCircle2,
  Volume2, VolumeX, HelpCircle, Settings, VolumeIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Type for video cards
interface VideoCardProps {
  icon: React.ReactNode;
  badgeLabel: string;
  title: string;
  description: string;
  videoTitle: string;
  videoSubtitle: string;
  duration: string;
  note: string;
  buttonText: string;
  demoPoints?: string[];
  placeholderImage?: string;
}

// Video generation states
type GenerationState = "idle" | "generating" | "ready" | "playing";

// Video Card Component
function VideoCard({
  icon, 
  badgeLabel, 
  title, 
  description, 
  videoTitle, 
  videoSubtitle,
  duration,
  note,
  buttonText,
  demoPoints = [],
  placeholderImage
}: VideoCardProps) {
  // States for the interactive AI video generation experience
  const [generationState, setGenerationState] = useState<GenerationState>("idle");
  const [progress, setProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceOverEnabled, setVoiceOverEnabled] = useState(true);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [voiceRate, setVoiceRate] = useState(1);
  const [voiceAccent, setVoiceAccent] = useState("British English");
  
  // Reference for speech synthesis
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Handle the generation process simulation
  const handleGenerate = () => {
    setGenerationState("generating");
    setProgress(0);
    
    // Simulate video generation process with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          setGenerationState("ready");
          return 100;
        }
        return next;
      });
    }, 300);
  };
  
  // Play the "generated" video
  const handlePlay = () => {
    setIsDialogOpen(true);
    setGenerationState("playing");
    setCurrentStep(0);
  };
  
  // Professional text-to-speech function with enhanced voice quality
  const speakText = (text: string) => {
    if (!voiceOverEnabled) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Process the text for more natural speech without saying "break time" tags
    // Instead of using SSML tags which might be read aloud, use chunking technique
    const textChunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    // Push each sentence as a separate chunk for natural pauses
    sentences.forEach(sentence => {
      textChunks.push(sentence);
    });
    
    // Function to speak each chunk with appropriate pauses
    const speakChunks = (chunks: string[], index = 0) => {
      if (index >= chunks.length) return;
      
      const chunk = chunks[index];
      const utterance = new SpeechSynthesisUtterance(chunk);
      speechSynthesisRef.current = utterance;
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Use a premium UK voice for professional narration
      // Try to find the best UK voice in order of preference
      const preferredVoices = ["Daniel", "Arthur", "Serena", "UK English Male", "GB English Male", "British English Male"];
      let selectedVoice: SpeechSynthesisVoice | null = null;
      
      for (const preferredVoice of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferredVoice));
        if (voice) {
          selectedVoice = voice;
          break;
        }
      }
      
      // If no preferred voice found, fallback to any UK voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.name.includes("UK") || 
          voice.name.includes("GB") || 
          voice.lang === "en-GB"
        );
      }
      
      // Apply the selected voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      // Professional voice tuning
      utterance.rate = voiceRate;         // Apply user-selected rate
      utterance.pitch = 1.02;             // Slightly higher for clarity but still natural
      utterance.volume = 1.0;             // Full volume
      
      // Add subtle intonation based on content
      if (chunk.includes("Welcome") || chunk.includes("welcome")) {
        utterance.pitch = 1.05;  // Slightly higher for greetings
      } else if (chunk.includes("?")) {
        utterance.pitch = 1.03;  // Question intonation
      } else if (chunk.includes("!")) {
        utterance.pitch = 1.04;  // Emphasis for exclamations
      }
      
      // Events
      utterance.onstart = () => setIsVoicePlaying(true);
      
      // When this chunk ends, speak the next one
      utterance.onend = () => {
        // If this was the last chunk, mark voice as done
        if (index === chunks.length - 1) {
          setIsVoicePlaying(false);
        } else {
          // Otherwise speak the next chunk
          speakChunks(chunks, index + 1);
        }
      };
      
      utterance.onerror = () => {
        console.error("Speech synthesis error");
        setIsVoicePlaying(false);
      };
      
      // Speak the current chunk
      window.speechSynthesis.speak(utterance);
    };
    
    // Start speaking chunks from the beginning
    speakChunks(textChunks);
  };
  
  // Toggle voice over functionality
  const toggleVoiceOver = () => {
    if (isVoicePlaying) {
      window.speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
    setVoiceOverEnabled(!voiceOverEnabled);
  };
  
  // Progress through the demo points during playback
  useEffect(() => {
    if (generationState !== "playing" || !isDialogOpen || !demoPoints?.length) return;
    
    // Speak the current point if voice-over is enabled
    if (voiceOverEnabled && demoPoints[currentStep]) {
      speakText(demoPoints[currentStep]);
    }
    
    const timer = setTimeout(() => {
      if (currentStep < demoPoints.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 6000); // Longer duration to allow for voice-over
    
    return () => {
      clearTimeout(timer);
      // Stop speech when unmounting or moving to next point
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, demoPoints, generationState, isDialogOpen, voiceOverEnabled]);
  
  // Load voices when component mounts
  useEffect(() => {
    // Load voices if they're not available yet
    if (window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length === 0) {
        const loadVoices = () => {
          window.speechSynthesis.getVoices();
          window.removeEventListener('voiceschanged', loadVoices);
        };
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => {
          window.removeEventListener('voiceschanged', loadVoices);
        };
      }
    }
  }, []);
  
  // Clean up speech synthesis when dialog closes
  useEffect(() => {
    if (!isDialogOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsVoicePlaying(false);
    }
  }, [isDialogOpen]);
  
  // Background style for the card
  const cardBackground = placeholderImage 
    ? { backgroundImage: `url(${placeholderImage})`, backgroundSize: 'cover' }
    : {};
  
  return (
    <>
      <Card className="border-primary/10 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="bg-primary/5 p-3">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-2">
            {icon} {badgeLabel}
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-md overflow-hidden">
            <div 
              className="w-full h-full rounded-lg shadow-lg bg-black flex items-center justify-center relative"
              style={cardBackground}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-70"></div>
              <div className="z-10 text-center px-6">
                {generationState === "idle" && (
                  <div className="bg-black/60 p-4 rounded-lg backdrop-blur-sm">
                    <h3 className="text-white text-lg font-bold mb-2">{videoTitle}</h3>
                    <p className="text-white/80 text-sm mb-4">
                      {videoSubtitle}
                    </p>
                    <button 
                      className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                      onClick={handleGenerate}
                    >
                      <Film className="h-4 w-4" />
                      {buttonText}
                    </button>
                  </div>
                )}
                
                {generationState === "generating" && (
                  <div className="bg-black/70 p-5 rounded-lg backdrop-blur-sm max-w-sm">
                    <h3 className="text-white text-lg font-bold mb-3">Generating Your Video</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>Processing...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      
                      <Progress value={progress} className="h-2" />
                      
                      <div className="text-left text-white/80 text-xs space-y-2 mt-4">
                        <p className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {progress < 30 ? "Analyzing content requirements..." : 
                           progress < 60 ? "Creating visual elements..." :
                           progress < 90 ? "Sequencing video frames..." :
                           "Finalizing video output..."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {generationState === "ready" && (
                  <div className="bg-black/70 p-5 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 text-white mb-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <h3 className="text-lg font-bold">Video Generated!</h3>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4">
                      Your custom {videoTitle.toLowerCase()} is ready to view
                    </p>
                    
                    <div className="flex gap-3 justify-center">
                      <button 
                        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                        onClick={handlePlay}
                      >
                        <Play className="h-4 w-4" />
                        Watch Now
                      </button>
                      
                      <button 
                        className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2"
                        onClick={handleGenerate}
                      >
                        <RefreshCw className="h-4 w-4" />
                        Regenerate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground pt-0">
          Duration: {duration} • {note}
        </CardFooter>
      </Card>
      
      {/* Video playback dialog */}
      {demoPoints.length > 0 && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl w-[90vw]">
            <DialogTitle className="text-xl font-semibold text-primary">{videoTitle}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              AI-generated walkthrough customized for UniMart
            </DialogDescription>
            
            <div className="mt-4">
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                {/* Video content simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-black/80 flex flex-col justify-center items-center p-8 text-center">
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/50 h-1 z-10">
                    <div 
                      className="bg-white h-full transition-all duration-500" 
                      style={{ width: `${demoPoints.length > 1 ? (currentStep / (demoPoints.length - 1)) * 100 : 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-white space-y-4 max-w-2xl">
                    <h3 className="text-2xl font-bold">{videoTitle}</h3>
                    <p className="text-xl leading-relaxed">{demoPoints[currentStep] || 'Loading content...'}</p>
                  </div>
                  
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                    <button className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                      <Pause className="h-5 w-5 text-white" />
                    </button>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={toggleVoiceOver} 
                            className={`bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors ${!voiceOverEnabled ? 'bg-white/10' : ''}`}
                          >
                            {voiceOverEnabled ? (
                              isVoicePlaying ? (
                                <div className="relative">
                                  <Volume2 className="h-5 w-5 text-primary animate-pulse" />
                                  <span className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full animate-ping" />
                                </div>
                              ) : (
                                <Volume2 className="h-5 w-5 text-white" />
                              )
                            ) : (
                              <VolumeX className="h-5 w-5 text-white/50" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {voiceOverEnabled ? 'Voice-over enabled' : 'Voice-over disabled'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <div className="text-white/70 text-sm flex items-center">
                      {currentStep + 1}/{demoPoints.length} • {Math.round(demoPoints.length > 1 ? (currentStep / (demoPoints.length - 1)) * 100 : 100)}% complete
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Key Highlights</h4>
                  <ul className="space-y-2">
                    {demoPoints.map((point, i) => (
                      <li key={i} className={`flex items-start gap-2 ${i === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        <span className={`${i === currentStep ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'} p-1 rounded-full mt-0.5 text-xs`}>
                          {i + 1}
                        </span>
                        <p className="text-sm">{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Voice settings */}
                <div className="bg-muted/40 rounded-lg p-4">
                  <h4 className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Volume2 className="h-4 w-4" /> Voice-Over Settings
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Voice-Over</label>
                      <button 
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                          ${voiceOverEnabled ? 'bg-primary' : 'bg-input'}`}
                        onClick={toggleVoiceOver}
                      >
                        <span
                          className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform
                            ${voiceOverEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium mb-1 block">Voice Speed</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0.5" 
                          max="1.5" 
                          step="0.1" 
                          value={voiceRate}
                          disabled={!voiceOverEnabled}
                          onChange={(e) => setVoiceRate(parseFloat(e.target.value))} 
                          className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                        <span className="text-xs font-mono w-8">{voiceRate}x</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">Voice Quality</label>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((level) => (
                            <button
                              key={level}
                              onClick={() => {
                                // Adjust pitch based on quality level
                                if (level === 1) setVoiceRate(Math.max(0.8, voiceRate - 0.1));
                                if (level === 2) setVoiceRate(1.0);
                                if (level === 3) setVoiceRate(Math.min(1.2, voiceRate + 0.1));
                              }}
                              disabled={!voiceOverEnabled}
                              className={`w-8 h-4 rounded-sm transition-colors ${
                                !voiceOverEnabled 
                                  ? 'bg-muted/30 cursor-not-allowed' 
                                  : voiceRate < 0.9 && level === 1
                                    ? 'bg-primary/80'
                                    : voiceRate >= 0.9 && voiceRate <= 1.1 && level === 2
                                      ? 'bg-primary/80'
                                      : voiceRate > 1.1 && level === 3
                                        ? 'bg-primary/80'
                                        : 'bg-primary/30 hover:bg-primary/50'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground italic">
                        {voiceOverEnabled 
                          ? "Premium British voice narrates each step with natural pauses and emphasis" 
                          : "Enable voice-over to hear the tutorial narrated as you watch"}
                      </p>
                      
                      <p className="text-xs text-primary/70 flex items-center gap-1.5">
                        <VolumeIcon className="h-3 w-3" />
                        Voice-over available for better accessibility
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export function VideoGuide() {
  // Video data
  const videoData: VideoCardProps[] = [
    {
      icon: <ShoppingCart className="w-3 h-3 mr-1" />,
      badgeLabel: "Customer Experience",
      title: "UniMart's Intuitive Shopping Journey",
      description: "See how UniMart's intuitive interface makes shopping effortless - from our smart category filters to personalized recommendations, lightning-fast search, and our streamlined one-page checkout process with saved payment methods",
      videoTitle: "Customer Onboarding Experience",
      videoSubtitle: "AI-generated walkthrough of the UniMart shopping experience",
      duration: "4:15",
      note: "Perfect for new UniMart shoppers",
      buttonText: "Generate Video Walkthrough",
      demoPoints: [
        "Welcome to UniMart! This guided tutorial will help you navigate our platform and make your first purchase.",
        "Create your account in seconds using email, Google, or Apple authentication. Your data is always secure.",
        "Explore our personalized homepage with recommended products based on your browsing preferences.",
        "Use our smart filtering system to narrow down products by price, ratings, shipping options, and more.",
        "Add items to your cart with one click. You can adjust quantities or save for later at any time.",
        "Our streamlined checkout process saves your delivery preferences and payment methods securely.",
        "Track your order in real-time through our intuitive order status page with live map integration.",
        "Receive personalized recommendations based on your purchase history for a tailored shopping experience."
      ]
    },
    {
      icon: <Package className="w-3 h-3 mr-1" />,
      badgeLabel: "Vendor Benefits",
      title: "UniMart's Powerful Vendor Dashboard",
      description: "Explore UniMart's comprehensive vendor portal with automated inventory management, bulk product uploads, real-time sales analytics, and our proprietary market trend analysis that helps you optimize pricing and increase your conversion rate",
      videoTitle: "Vendor Onboarding Guide",
      videoSubtitle: "AI-generated tutorial for setting up your UniMart vendor account",
      duration: "6:30",
      note: "Essential for all UniMart sellers",
      buttonText: "Generate Vendor Tutorial",
      demoPoints: [
        "Welcome to the UniMart Vendor Portal. Let's set up your successful selling journey on our platform.",
        "Register as a verified vendor with our simple verification process that ensures quality for all marketplace participants.",
        "Configure your store profile with customizable branding elements, business policies, and shipping preferences.",
        "Use our bulk upload tool to easily list multiple products with automatic category suggestions and pricing optimizations.",
        "Access our real-time analytics dashboard showing key metrics like conversion rates, traffic sources, and customer demographics.",
        "Set up automated inventory management to prevent stockouts and maintain accurate product availability.",
        "Configure payment preferences with multiple payout options and view detailed transaction histories.",
        "Utilize our AI-powered market trend analysis to identify pricing opportunities and product gaps in the marketplace.",
        "Access our vendor support team 24/7 through dedicated channels for priority assistance with any issues."
      ]
    },
    {
      icon: <CreditCard className="w-3 h-3 mr-1" />,
      badgeLabel: "Payment & Security",
      title: "UniMart's Safe Payment System",
      description: "Learn about UniMart's secure payment infrastructure with bank-level encryption, saved payment methods, our buyer protection program, and optional two-factor authentication for purchases - providing peace of mind with every transaction",
      videoTitle: "Payment Security Overview",
      videoSubtitle: "AI-generated guide to UniMart's payment protection features",
      duration: "5:45",
      note: "Updated with latest security features",
      buttonText: "Generate Security Video",
      demoPoints: [
        "UniMart employs bank-level encryption for all payment transactions to ensure your financial information is always secure.",
        "Our payment system supports multiple methods including credit cards, digital wallets, and buy-now-pay-later options.",
        "Enable optional two-factor authentication for purchases above a certain threshold that you can customize.",
        "All saved payment methods are tokenized and never stored directly on our servers for maximum security.",
        "Our Buyer Protection Program covers every purchase with automated dispute resolution and guaranteed refunds for eligible issues.",
        "Real-time fraud detection systems monitor transactions for suspicious activities to prevent unauthorized purchases.",
        "Secure checkout pages with visual security indicators show you when your connection is encrypted and secure.",
        "Vendor payments are securely processed through our escrow system to ensure quality before funds are released."
      ]
    },
    {
      icon: <Package className="w-3 h-3 mr-1" />,
      badgeLabel: "Product Management",
      title: "UniMart's Advanced Product Tools",
      description: "Master UniMart's unique product management system with our AI-assisted descriptions, automatic image optimization, variant generator, and category recommendation engine - helping your products rank higher in search results",
      videoTitle: "Product Management Demo",
      videoSubtitle: "AI-generated demonstration of the vendor product dashboard",
      duration: "7:20",
      note: "Maximize your product visibility",
      buttonText: "Generate Product Demo",
      demoPoints: [
        "Welcome to UniMart's advanced product management system designed to help vendors maximize visibility and sales.",
        "Our AI-assisted description generator creates compelling product descriptions from basic information you provide.",
        "The automatic image optimizer enhances product photos, adjusts lighting, removes backgrounds, and creates consistent sizing.",
        "Use our variant generator to quickly create multiple product options like sizes, colors, and materials with bulk pricing.",
        "The category recommendation engine suggests optimal placement based on product attributes and customer search patterns.",
        "Set up dynamic pricing rules based on inventory levels, competitor pricing, and seasonal demand patterns.",
        "Our SEO tools analyze your listings and suggest keywords to improve search visibility within UniMart's marketplace.",
        "Schedule promotional periods in advance with automated price changes and featured placement opportunities.",
        "Track product performance metrics including view-to-purchase ratio, search ranking position, and customer engagement stats."
      ]
    },
    {
      icon: <Smartphone className="w-3 h-3 mr-1" />,
      badgeLabel: "Mobile App",
      title: "UniMart's Mobile Experience",
      description: "Discover the UniMart mobile app with offline browsing capabilities, barcode scanning for instant price matching, geolocation for delivery estimates, and instant push notifications for order updates and exclusive mobile-only deals",
      videoTitle: "Mobile App Walkthrough",
      videoSubtitle: "AI-generated demonstration of the UniMart mobile experience",
      duration: "4:50",
      note: "Shop UniMart anywhere, anytime",
      buttonText: "Generate Mobile Demo",
      demoPoints: [
        "The UniMart mobile app puts the entire marketplace in your pocket with a seamless, optimized experience.",
        "Use our barcode scanner to instantly check prices and availability of products you find in physical stores.",
        "Enable offline browsing to view recently viewed products and saved lists even without an internet connection.",
        "Geolocation features provide accurate delivery estimates and nearby pickup options for faster service.",
        "Receive instant push notifications for order updates, price drops on wishlist items, and exclusive mobile-only deals.",
        "The mobile-optimized checkout process supports biometric authentication for secure, one-tap purchasing.",
        "Access your personalized feed of recommended products based on your browsing and purchase history.",
        "Use the augmented reality feature to visualize certain products in your own space before purchasing."
      ]
    },
    {
      icon: <Truck className="w-3 h-3 mr-1" />,
      badgeLabel: "Delivery System",
      title: "UniMart's Streamlined Delivery",
      description: "Follow the journey of a UniMart order from purchase to doorstep, featuring our proprietary delivery network, real-time package tracking with live map views, delivery time estimator, and our easy return process with free pickup",
      videoTitle: "Delivery Process Visualization",
      videoSubtitle: "AI-generated walkthrough of the order fulfillment process",
      duration: "5:10",
      note: "Track your orders in real-time",
      buttonText: "Generate Delivery Demo",
      demoPoints: [
        "When you place an order on UniMart, our intelligent routing system immediately assigns it to the optimal fulfillment center.",
        "Our proprietary algorithm considers inventory availability, distance to delivery address, and carrier performance for routing decisions.",
        "Track your package with real-time updates and live map views showing exactly where your order is in the delivery process.",
        "The delivery time estimator uses historical data, current traffic conditions, and weather patterns for accurate arrival predictions.",
        "Receive automated notifications at key fulfillment stages: processing, packaging, dispatch, and final delivery.",
        "Our advanced door-to-door tracking system includes photo verification of delivery for added security and confirmation.",
        "The easy return process allows you to schedule free pickup of returns without needing to print labels or visit a shipping location.",
        "For eligible items, our instant refund option processes your refund immediately when the return is initiated rather than when received."
      ]
    }
  ];

  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">UniMart Video Tutorials</h2>
        <p className="text-muted-foreground text-lg">
          These AI-generated tutorials highlight the smooth, seamless experience that UniMart provides for both shoppers and sellers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videoData.slice(0, 2).map((video, index) => (
          <VideoCard key={index} {...video} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {videoData.slice(2, 4).map((video, index) => (
          <VideoCard key={index + 2} {...video} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {videoData.slice(4, 6).map((video, index) => (
          <VideoCard key={index + 4} {...video} />
        ))}
      </div>
    </div>
  );
}
