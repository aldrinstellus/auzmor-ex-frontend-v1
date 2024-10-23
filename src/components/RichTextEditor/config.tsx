import { renderToString } from 'react-dom/server';
import ReactionSkeleton from 'components/Post/components/ReactionModal/ReactionSkeleton';
import apiService, { getProduct, ProductEnum } from 'utils/apiService';
import {
  createMentionsList,
  createHashtagsList,
  newHashtags,
} from './mentions/utils';
import { extractFirstWord } from 'utils/misc';
import { UserStatus } from 'interfaces';
import { mapUser } from 'queries/learn/users';

// interface IOrg {
//   id: string;
//   name: string;
// }
// interface IFlags {
//   isDeactivated: string;
//   isReported: string;
// }
// interface IUserMentions {
//   id: string;
//   charDenotation: string;
//   fullName: string;
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   primaryEmail: string;
//   org: IOrg;
//   workEmail: string;
//   role: string;
//   flags: IFlags;
//   createdAt: string;
//   status: string;
// }

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
    const getAllUser =
      getProduct() === ProductEnum.Lxp
        ? apiService.get('/mentions/auto_suggest', {
            identifier: '@',
            q: searchTerm || '',
          })
        : apiService.get('/users', {
            q: searchTerm,
            status: [UserStatus.Active],
          });
    const { data: mentions } = await getAllUser;
    const mentionList =
      getProduct() === ProductEnum.Lxp
        ? mentions?.result?.data.map(mapUser)
        : mentions?.result?.data;

    return createMentionsList(mentionList, character);
  } else if (character === '#' && !isContainWhiteSpace) {
    const hashtag = extractFirstWord(searchTerm);
    const { data: hashtags } = await apiService.get('/hashtags', {
      q: hashtag,
    });
    const hashtagList = hashtags?.result?.data;
    const isOlderHashtag = hashtagList?.some((hashValue: IHashtags) => {
      if (hashtag) {
        return hashValue?.name?.startsWith(hashtag);
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
  },
  dataAttributes: ['id'],
  showDenotationChar: true,
  onOpen: () => {}, // Callback when mention dropdown is open.
  onclose: () => {}, // Callback when mention dropdown is closed.
  renderLoading: () => {
    return renderToString(<ReactionSkeleton />);
  },
  renderItem: (item: any, _searchItem: any) => {
    if (item?.charDenotation === '@') {
      return `
      <div class="user-container">

            <div class="user-avatar">
                  ${
                    item?.profileImage?.original
                      ? `<img 
                          src=${item?.profileImage?.original} 
                          style="width:32px;height:32px;border-radius: 100px;
                          alt="Profile Picture"
                    "/>`
                      : `<div class="user-avatar-name"> 
                            ${
                              item?.firstName?.charAt(0) +
                                item?.lastName?.charAt(0) ||
                              item?.fullName
                                ?.split(' ')
                                .map((name: any) =>
                                  name.charAt(0).toUpperCase(),
                                )
                                .join('')
                            }
                        </div>`
                  }
            </div>

            <div>
              <div class="user-details">
              <span> ${
                item?.preferredName?.trim()
                  ? `${item?.preferredName} (${item?.fullName})`
                  : item?.fullName
              }</span>
              <div>
                <div class="user-email">${item?.workEmail}</div>
            </div>

</div>
            `;
    } else if (item.charDenotation === '#') {
      return `
            <div class="hashtag-container">
              <div>${item?.name}</div>
            </div>
      `;
    } else {
      return null;
    }
  },
  positioningStrategy: 'fixed',
};
