
import { Heart, Mail, Phone, MapPin, Clock, Globe, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-700">
      {/* Main Footer Content */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Usman Hardware</h3>
                <p className="text-slate-400 text-xs">Furniture Hardware Specialist</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for premium furniture hardware solutions. Quality products, competitive prices, and exceptional service since 2010.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <div className="space-y-2">
              {[
                'Product Catalog',
                'Bulk Orders',
                'Price List',
                'Delivery Schedule',
                'Return Policy',
                'Warranty Claims'
              ].map((link) => (
                <Button
                  key={link}
                  variant="ghost"
                  className="h-auto p-0 text-slate-400 hover:text-white justify-start"
                >
                  {link}
                </Button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Our Services</h4>
            <div className="space-y-2">
              {[
                'Hardware Supply',
                'Custom Solutions',
                'Technical Support',
                'Installation Guide',
                'Quality Assurance',
                'After Sales Service'
              ].map((service) => (
                <Button
                  key={service}
                  variant="ghost"
                  className="h-auto p-0 text-slate-400 hover:text-white justify-start"
                >
                  {service}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <div className="text-sm">
                  <p className="text-white">Main Bazaar, Hafizabad</p>
                  <p className="text-slate-400">Punjab, Pakistan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <div className="text-sm">
                  <p className="text-white">+92 300 1234567</p>
                  <p className="text-slate-400">+92 547 123456</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <div className="text-sm">
                  <p className="text-white">info@usmanhardware.pk</p>
                  <p className="text-slate-400">orders@usmanhardware.pk</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-blue-400" />
                <div className="text-sm">
                  <p className="text-white">Mon - Sat: 8:00 AM - 8:00 PM</p>
                  <p className="text-slate-400">Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-700 px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <p className="text-slate-400">
              © 2024 Usman Hardware. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" className="h-auto p-0 text-slate-400 hover:text-white text-sm">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="h-auto p-0 text-slate-400 hover:text-white text-sm">
                Terms of Service
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>in Pakistan</span>
            <Badge className="bg-emerald-600 text-white text-xs">
              v2.1.0
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
