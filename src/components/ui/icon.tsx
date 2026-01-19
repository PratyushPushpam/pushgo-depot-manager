import { 
  Database, 
  Plus, 
  Search, 
  User, 
  Phone, 
  Home, 
  Map, 
  ExternalLink, 
  Share2, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  AlertCircle, 
  Check,
  LucideIcon
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Database,
  Plus,
  Search,
  User,
  Phone,
  Home,
  Map,
  ExternalLink,
  Share2,
  Edit2,
  Trash2,
  X,
  MapPin,
  AlertCircle,
  Check
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
}

export const Icon = ({ name, size = 24, className, ...props }: IconProps) => {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon ${name} not found`);
    return null;
  }

  return <LucideIcon size={size} className={className} {...props as any} />;
};
