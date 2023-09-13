import React from 'react';
import apiService from 'utils/apiService';
import {
  createMentionsList,
  createHashtagsList,
  newHashtags,
} from './mentions/utils';
import { renderToString } from 'react-dom/server';
import ReactionSkeleton from 'components/Post/components/ReactionSkeleton';
import { extractFirstWord } from 'utils/misc';
import Skeleton from 'react-loading-skeleton';

interface IOrg {
  id: string;
  name: string;
}
interface IFlags {
  isDeactivated: string;
  isReported: string;
}
interface IUserMentions {
  id: string;
  charDenotation: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  primaryEmail: string;
  org: IOrg;
  workEmail: string;
  role: string;
  flags: IFlags;
  createdAt: string;
  status: string;
}

interface IHashtags {
  id: string;
  name: string;
  charDenotation: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export const previewLinkRegex = /(http|https):\/\/[^\s]+/gi;
const mentionEntityFetch = async (character: string, searchTerm: string) => {
  const isContainWhiteSpace = /^\s/.test(searchTerm);
  if (character === '@' && !isContainWhiteSpace) {
    const { data: mentions } = await apiService.get('/users', {
      q: searchTerm,
    });
    const mentionList = mentions?.result?.data;
    return createMentionsList(mentionList, character);
  } else if (character === '#' && !isContainWhiteSpace) {
    const hashtag = extractFirstWord(searchTerm);
    const { data: hashtags } = await apiService.get('/hashtags', {
      q: hashtag,
    });
    const hashtagList = hashtags?.result?.data;
    const isOlderHashtag = hashtagList?.some((hashValue: IHashtags) => {
      if (hashtag) {
        return hashValue?.name === hashtag;
      } else {
        return true;
      }
    });
    if (isOlderHashtag) {
      return createHashtagsList(hashtagList, character);
    } else {
      return newHashtags({ name: hashtag }, character);
    }
  } else if (isContainWhiteSpace) {
    return null;
  }
};

export const mention = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['@', '#'],
  source: (
    searchTerm: string,
    renderItem: (
      arg0: { id: number; value: string; src: string }[] | undefined,
      arg1: any,
    ) => void,
    mentionChar: string,
  ) => {
    mentionEntityFetch(mentionChar, searchTerm).then((listItem: any) => {
      renderItem(listItem, searchTerm);
    });
    // Loaders =
    // mentionChar === '@' ? (
    //   <ReactionSkeleton />
    // ) : (
    //   <div>
    //     {[...Array(4)].map((value, index) => (
    //       <div className="flex gap-x-2 items-start py-5" key={index}>
    //         <Skeleton className="!w-56 h-3" count={1} borderRadius={100} />
    //       </div>
    //     ))}
    //   </div>
    // );
  },
  dataAttributes: ['id'],
  showDenotationChar: true,
  onOpen: () => {},
  onclose: () => {},
  renderLoading: (mentionChar: string) => {
    console.log({ mentionChar });
    return renderToString(
      mentionChar === '@' ? (
        <ReactionSkeleton />
      ) : (
        <div>
          {[...Array(4)].map((value, index) => (
            <div className="flex items-start px-6 py-3" key={index}>
              <Skeleton className="!w-24 h-3" count={1} borderRadius={100} />
            </div>
          ))}
        </div>
      ),
    );
  },
  renderItem: (item: any, searchItem: any) => {
    if (item?.charDenotation === '@') {
      return `
              <div class="user-container">

                    <div class="user-avatar">
                          ${
                            item?.profileImage?.original
                              ? `<img 
                                  src=${item?.profileImage?.original} 
                                  style="width:32px;height:32px;border-radius: 100px;
                            "/>`
                              : `<div class="user-avatar-name"> 
                                    ${
                                      item?.firstName?.charAt(0) +
                                        item?.lastName?.charAt(0) ||
                                      item?.fullName?.charAt(0).toUpperCase()
                                    }
                                </div>`
                          }
                    </div>

                    <div>
                      <div class="user-details">
                        <div>${item.fullName}</div>
                      <div>
                        <div class="user-email">${item.workEmail}</div>
                    </div>

              </div>
            `;
    } else if (item.charDenotation === '#') {
      return `
            <div class="hashtag-container">
              <div class="hashtag-name">#${item?.name}</div>      
            </div>        
      `;
    } else {
      return null;
    }
  },
  positioningStrategy: 'fixed',
};
