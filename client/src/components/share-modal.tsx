import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Facebook, Instagram, Copy } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: {
    text: string;
    author: string;
    category: string;
  };
}

export function ShareModal({ isOpen, onClose, quote }: ShareModalProps) {
  const { toast } = useToast();

  const shareText = `"${quote.text}" — ${quote.author}`;

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    onClose();
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    onClose();
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct text sharing, so we'll copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "Quote copied! You can now paste it on Instagram.",
      });
      onClose();
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "Quote has been copied to your clipboard.",
      });
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-playfair font-semibold">Share Quote</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            onClick={shareToTwitter}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            <Twitter className="w-5 h-5" />
            <span>Twitter</span>
          </Button>
          
          <Button
            onClick={shareToFacebook}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span>Facebook</span>
          </Button>
          
          <Button
            onClick={shareToInstagram}
            className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Instagram className="w-5 h-5" />
            <span>Instagram</span>
          </Button>
          
          <Button
            onClick={copyToClipboard}
            className="flex items-center justify-center space-x-2 p-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-5 h-5" />
            <span>Copy</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
