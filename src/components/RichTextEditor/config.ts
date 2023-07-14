import apiService from 'utils/apiService';
import { createMentionsList, createHashtagsList } from './mentions/utils';

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
  if (character === '@' && searchTerm !== '') {
    const { data: mentions } = await apiService.get('/users', {
      q: searchTerm,
    });
    const mentionList = mentions?.result?.data;
    return createMentionsList(mentionList, character);
  } else if (character === '#' && searchTerm !== '') {
    const { data: hashtags } = await apiService.get('/hashtags', {
      q: searchTerm,
    });
    const hashtagList = hashtags?.result;
    return createHashtagsList(hashtagList, character);
  } else {
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
  renderLoading: () => {},
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
                    <div class="user-details">
                      <span>${item.fullName}</span>
                    <div>
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
