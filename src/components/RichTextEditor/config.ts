import apiService from 'utils/apiService';
import { createMentionsList } from './mentions/utils';

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

export const previewLinkRegex = /(http|https):\/\/[^\s]+/gi;

const mentionEntityFetch = async (mentionChar: string, searchTerm: string) => {
  let list;
  const { data } = await apiService.get('/users', { q: searchTerm });
  if (mentionChar === '@') {
    list = data?.result?.data;
  }
  return createMentionsList(list);
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
    mentionEntityFetch(mentionChar, searchTerm).then((mentionList) => {
      if (searchTerm.length === 0) {
        renderItem(mentionList, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < mentionList.length; i++)
          if (
            ~mentionList[i].value
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase())
          )
            matches.push(mentionList[i]);
        renderItem(matches, searchTerm);
      }
    });
  },
  dataAttributes: ['id'],
  showDenotationChar: false,
  onOpen: () => {}, // Callback when mention dropdown is open.
  onclose: () => {}, // Callback when mention dropdown is closed.
  renderLoading: () => {},
  renderItem: (item: IUserMentions, searchItem: any) => {
    return `<div>
              <div style="display:flex; padding:5px">
                <img style="width:40px; height:40px; border-radius:50px" src="https://radarcirebon.id/wp-content/uploads/2023/02/baca-komik-lookism.png" alt="${item.id}"/>
                <div style="margin-left:10px">${item.fullName}<div>
              </div>
            </div>`;
  },
};
