import { IAudience } from './audience';

export interface IAppIcon {
  id: string;
  original: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  blurHash?: string;
}

export interface IAppCredentials {
  acsUrl: string;
  entityId: string;
  relayState: string;
}

export interface IApp {
  id: string;
  url: string;
  label: string;
  description: string;
  category: Record<string, any>;
  icon: IAppIcon;
  credentials: IAppCredentials;
  audience?: IAudience[];
  featured?: boolean;
  createdAt: string;
}
