import React, { SetStateAction, useState } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import { usePreviewLink } from 'queries/post';

type Metadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical_url?: string;
  favicon?: string;
  author?: string;
  oEmbed?: {
    type: 'photo' | 'video' | 'link' | 'rich';
    version?: string;
    title?: string;
    author_name?: string;
    author_url?: string;
    provider_name?: string;
    provider_url?: string;
    cache_age?: number;
    thumbnails?: [
      {
        url?: string;
        width?: number;
        height?: number;
      },
    ];
  };
  twitter_card: {
    card: string;
    site?: string;
    creator?: string;
    creator_id?: string;
    title?: string;
    description?: string;
    players?: {
      url: string;
      stream?: string;
      height?: number;
      width?: number;
    }[];
    apps: {
      iphone: {
        id: string;
        name: string;
        url: string;
      };
      ipad: {
        id: string;
        name: string;
        url: string;
      };
      googleplay: {
        id: string;
        name: string;
        url: string;
      };
    };
    images: {
      url: string;
      alt: string;
    }[];
  };
  open_graph: {
    title: string;
    type: string;
    images?: {
      url: string;
      secure_url?: string;
      type: string;
      width: number;
      height: number;
      alt?: string;
    }[];
    url?: string;
    audio?: {
      url: string;
      secure_url?: string;
      type: string;
    }[];
    description?: string;
    determiner?: string;
    site_name?: string;
    locale: string;
    locale_alt: string;
    videos: {
      url: string;
      stream?: string;
      height?: number;
      width?: number;
      tags?: string[];
    }[];
    article: {
      published_time?: string;
      modified_time?: string;
      expiration_time?: string;
      author?: string;
      section?: string;
      tags?: string[];
    };
  };
};

export type PreviewLinkProps = {
  link: string[];
  setShowPreview: (show: boolean) => void;
};

const imagePreviewLink = (
  metadata: Record<string, any>,
  setShowPreview: { (show: boolean): void; (arg0: boolean): void },
) => {
  return (
    <Card className="mx-6 mb-9">
      <div className="">
        <div className="relative">
          <img
            src={metadata?.open_graph?.images[0]?.url}
            alt={metadata?.title}
            className="w-full h-40 rounded-md object-cover"
          />
          <button
            className="absolute top-0 right-0 p-2 bg-white border-1 border-neutral-200 border-solid rounded-7xl m-4 h-8 w-8"
            onClick={() => {
              setShowPreview(false);
            }}
          >
            <Icon name="cancel" size={10} />.
          </button>
        </div>
        <div className="flex flex-col bg-neutral-50 p-4">
          <div className="font-bold text-sm text-neutral-900">
            {metadata?.title}
          </div>
          <div className="text-xs text-neutral-500 font-normal mt-2">
            {metadata?.canonical_url}
          </div>
        </div>
      </div>
    </Card>
  );
};

const PreviewLink: React.FC<PreviewLinkProps> = ({ link, setShowPreview }) => {
  const { data, isLoading } = usePreviewLink(link[0]);
  console.log(link, '$$$', '%', data);
  return (
    <div>
      {link.length > 0 ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center mb-14">
              <div className="text-neutral-900 text-xs font-normal text">
                Loading Preview
              </div>
            </div>
          ) : (
            <div>
              {data?.open_graph?.images[0]?.url
                ? imagePreviewLink(data, setShowPreview)
                : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PreviewLink;
