import React from 'react';
import {
  Building2,
  Receipt,
  BookOpenCheck,
  ShieldCheck,
  Briefcase,
  Calculator,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Users,
  Shield,
  HelpCircle,
  LucideProps,
} from 'lucide-react';

interface IconRendererProps extends LucideProps {
  name: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Building2':
      return <Building2 className={className} {...props} />;
    case 'ReceiptCheck':
    case 'Receipt':
      return <Receipt className={className} {...props} />;
    case 'BookOpenCheck':
      return <BookOpenCheck className={className} {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} {...props} />;
    case 'Briefcase':
      return <Briefcase className={className} {...props} />;
    case 'Calculator':
      return <Calculator className={className} {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} {...props} />;
    case 'Phone':
      return <Phone className={className} {...props} />;
    case 'Mail':
      return <Mail className={className} {...props} />;
    case 'MapPin':
      return <MapPin className={className} {...props} />;
    case 'Clock':
      return <Clock className={className} {...props} />;
    case 'Award':
      return <Award className={className} {...props} />;
    case 'Users':
      return <Users className={className} {...props} />;
    case 'Shield':
      return <Shield className={className} {...props} />;
    case 'HelpCircle':
      return <HelpCircle className={className} {...props} />;
    case 'FileText':
    default:
      return <FileText className={className} {...props} />;
  }
};
