import { createMentionsList } from './mentions/utils';
interface IUserMentions {
  avatar?: string;
  title?: string;
  id: string;
  value: string;
  name: string;
}

export const previewLinkRegex = /(http|https):\/\/[^\s]+/gi;

const mentionEntityFetch = (mentionChar: string, searchTerm: string) => {
  let list;
  if (mentionChar === '@') {
    list = [
      {
        id: 1,
        avatar: 'https://i.redd.it/8xy61k0ovfy51.png',
        value: 'Umbrella Academy',
        name: 'Umbrella Academy',
        title: 'Star',
      },
      {
        id: 2,
        avatar:
          'https://cdn.vox-cdn.com/thumbor/LcWgMN2KXuIOiPN6CajkD-CWS24=/0x0:1280x960/1400x1400/filters:focal(0x0:1280x960):format(jpeg)/cdn.vox-cdn.com/uploads/chorus_image/image/44251740/peaky_s1_009_h.0.0.jpg',
        value: 'Peaky Blinder',
        name: 'Peaky Blinder',
        title: 'Drama',
      },
      {
        id: 3,
        avatar:
          'https://radarcirebon.id/wp-content/uploads/2023/02/baca-komik-lookism.png',
        value: 'Lookism',
        name: 'Lookism',
        title: 'Anime',
      },
    ];
  } else {
    list = [
      {
        id: 1,
        value: 'Office',
        name: 'Office',
      },
      {
        id: 2,
        value: 'c2c',
        name: 'c2c',
      },
      {
        id: 3,
        value: 'sharktank',
        name: 'sharktank',
      },
    ];
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
    let values = [];
    const mentionList = mentionEntityFetch(mentionChar, searchTerm);
    values = mentionList;
    if (searchTerm.length === 0) {
      renderItem(values, searchTerm);
    } else {
      const matches = [];
      for (let i = 0; i < values.length; i++)
        if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
          matches.push(values[i]);
      renderItem(matches, searchTerm);
    }
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
                <div style="margin-left:10px">${item.value}<div>
              </div>
            </div>`;
  },
};
