import React from 'react';
import Card from 'components/Card';
import { usePreviewLink } from 'queries/post';

export type PreviewLinkProps = {
  link: string[];
};

const imagePreviewLink = (data: Record<string, any>) => {
  return (
    <Card className="mx-6 mb-9">
      <div className="">
        <img
          src={data?.open_graph?.images[0]?.url}
          className="w-full h-40 rounded-md"
        />
        <div className="flex flex-col bg-neutral-50 p-4">
          <div className="font-bold text-sm text-neutral-900">
            {data?.title}
          </div>
          <div className="text-xs text-neutral-500 font-normal mt-2">
            {data?.canonical_url}
          </div>
        </div>
      </div>
    </Card>
  );
};

const PreviewLink: React.FC<PreviewLinkProps> = ({ link }) => {
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
              {data?.open_graph?.images[0]?.url ? imagePreviewLink(data) : null}
            </div>
          )}
        </div>
      ) : null}
      {}
    </div>
  );
};

export default PreviewLink;
