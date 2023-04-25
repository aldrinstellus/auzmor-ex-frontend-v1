import React, { Dispatch, SetStateAction, useState } from 'react';
import BlueLike from 'images/Like.png';
import Love from 'images/Love.png';
import Celebrate from 'images/Celebrate.png';
import Support from 'images/Support.png';
import Laugh from 'images/Laugh.png';
import Insightful from 'images/Insightful.png';

interface LikesProps {
  name: string;
  likeIcon: string;
  likeButtonColor: string;
  setName: Dispatch<SetStateAction<string>>;
  setLikeIcon: Dispatch<SetStateAction<string>>;
  setLikeButtonColor: Dispatch<SetStateAction<string>>;
}

export const Likes: React.FC<LikesProps> = ({
  setName,
  setLikeIcon,
  setLikeButtonColor,
  name,
  likeIcon,
  likeButtonColor,
}) => {
  return (
    <>
      <button className="flex items-center [&_div]:hover:visible">
        <img src={likeIcon} height={13.33} width={13.33} />
        <div className={`text-xs font-normal ml-1.5 ${likeButtonColor}`}>
          {name}
        </div>
        <div
          id="abc"
          className=" bg-white h-7 rounded-lg invisible absolute z-1 mb-[50px] shadow-md "
        >
          <div className="mx-2 py-2 flex flex-row">
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setName('Like');
                setLikeIcon(BlueLike);
                setLikeButtonColor('text-[#173E90]');
              }}
            >
              <img src={BlueLike} height={16} width={16} />
            </button>
            <button
              className="mx-1.5  hover:scale-150"
              onClick={() => {
                setName('Love');
                setLikeIcon(Love);
                setLikeButtonColor('text-[#F96B40]');
              }}
            >
              <img src={Love} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setName('Celebrate');
                setLikeIcon(Celebrate);
                setLikeButtonColor('text-yellow-500');
              }}
            >
              <img src={Celebrate} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setName('Support');
                setLikeIcon(Support);
                setLikeButtonColor('text-red-500');
              }}
            >
              <img src={Support} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setName('Funny');
                setLikeIcon(Laugh);
                setLikeButtonColor('text-yellow-500');
              }}
            >
              <img src={Laugh} height={16} width={16} />
            </button>
            <button
              className="mx-1.5 hover:scale-150"
              onClick={() => {
                setName('insightful');
                setLikeIcon(Insightful);
                setLikeButtonColor('text-yellow-500');
              }}
            >
              <img src={Insightful} height={16} width={16} />
            </button>
          </div>
        </div>
      </button>
    </>
  );
};
