// import { getEmoji } from "../../EmojiBlot";

function attachDataValues(element, data, dataAttributes) {
  const mention = element;
  Object.keys(data).forEach((key) => {
    if (dataAttributes.indexOf(key) > -1) {
      mention.dataset[key] = data[key];
    } else {
      delete mention.dataset[key];
    }
  });
  return mention;
}

function getMentionCharIndex(text, mentionDenotationChars) {
  return mentionDenotationChars.reduce(
    (prev, mentionChar) => {
      const mentionCharIndex = text.lastIndexOf(mentionChar);

      if (mentionCharIndex > prev.mentionCharIndex) {
        return {
          mentionChar,
          mentionCharIndex,
        };
      }
      return {
        mentionChar: prev.mentionChar,
        mentionCharIndex: prev.mentionCharIndex,
      };
    },
    { mentionChar: null, mentionCharIndex: -1 },
  );
}

function hasValidChars(text, allowedChars) {
  return allowedChars.test(text);
}

function hasValidMentionCharIndex(mentionCharIndex, text, isolateChar) {
  if (mentionCharIndex > -1) {
    if (
      isolateChar &&
      !(mentionCharIndex === 0 || !!text[mentionCharIndex - 1].match(/\s/g))
    ) {
      return false;
    }
    return true;
  }
  return false;
}

// create user mention list with the require props
function createMentionsList(mentionsList, character) {
  console.log('char', character);
  const atValues = [];
  // eslint-disable-next-line array-callback-return
  mentionsList &&
    mentionsList.map((mention) => {
      const val = mention.fullName;
      atValues.push({
        ...mention,
        charDenotation: character,
        name: val,
        value: val,
        avatar: null, // profile image
        title: 'Anything', // Profile Designation
      });
    });
  return atValues;
}

// create hashtag functionality
function createHashtagsList(hashtagsList, character) {
  const atValues = [];
  hashtagsList &&
    hashtagsList.map((hashtag) => {
      const val = hashtag.name;
      atValues.push({
        ...hashtag,
        charDenotation: character,
        name: val,
        value: val,
      });
    });
  return atValues;
}

// parsing the mention
function parseMentionData(delta, mentionsData) {
  const updatedData = [];
  if (delta && delta.ops && mentionsData.length) {
    // eslint-disable-next-line array-callback-return
    delta.ops.map((e) => {
      if (e.insert.mention) {
        const currentMentionData = mentionsData.find(
          (mention) => parseInt(mention.id) === parseInt(e.insert.mention.id),
        );
        if (currentMentionData) {
          let value = currentMentionData.name || e.insert.mention.value;
          const title = currentMentionData.additionalInfo
            ? currentMentionData.additionalInfo.designation
            : e.insert.mention.title;
          const imageUrl = currentMentionData.additionalInfo
            ? currentMentionData.additionalInfo.imageUrl
            : e.insert.mention.imageUrl;

          const insert = {
            mention: {
              ...e.insert.mention,
              value,
              title,
              imageUrl,
            },
          };
          updatedData.push({ insert });
        } else {
          const insert = {
            mention: {
              ...e.insert.mention,
            },
          };
          updatedData.push({ insert });
        }
      } else {
        updatedData.push(e);
      }
    });
    return { ops: updatedData };
  }
  return delta;
}

function getStyledText(completeText, isList, attributes, listType) {
  // get the last line
  const completeTextArray = completeText.split('\n');
  let lastText = `<li>${completeTextArray.pop()}</li>`;
  if (attributes.list && attributes.list === 'bullet') {
    if (listType !== attributes.list) {
      lastText = `</ol><ul>${lastText}`;
    } else if (!isList) {
      lastText = `<ul>${lastText}`;
    }

    return completeTextArray.join('') + lastText;
  }
  if (attributes.list && attributes.list === 'ordered') {
    if (listType !== attributes.list) {
      lastText = `</ul><ol>${lastText}`;
    } else if (!isList) {
      lastText = `<ol>${lastText}`;
    }

    return completeTextArray.join('') + lastText;
  }
  return completeText;
}

// generating plain text from HTML quill editor
function generatePlainText(rteReference) {
  let completeText = '';
  let list = false;
  let listType = '';
  if (rteReference.current) {
    rteReference.current
      .getEditor()
      .getContents()
      .forEach((op) => {
        if (typeof op.insert === 'string') {
          if (op.attributes && op.attributes.list) {
            completeText = getStyledText(
              completeText,
              list,
              op.attributes,
              listType,
            );
            if (listType !== '' && listType !== op.attributes.list) {
              if (listType === 'bullet') {
                listType = op.attributes.list;
              } else if (listType === 'ordered') {
                listType = op.attributes.list;
              }
            }
            if (!list) {
              list = true;
              listType = op.attributes.list;
            }
          } else if (op.insert.includes('\n')) {
            list = false;
            let endTag = '';
            if (listType === 'bullet') {
              endTag = '</ul>';
              listType = '';
            } else if (listType === 'ordered') {
              endTag = '</ol>';
              listType = '';
            }
            completeText += endTag;
          }
          completeText += op.insert;
        }
        if (op.insert.mention)
          completeText += `{{${op.insert.mention.id}}}{{${op.insert.mention.type}}}`;
        // if (op.insert.emoji) completeText += getEmoji(op.insert.emoji);
      });
  }
  return completeText;
}

export {
  attachDataValues,
  getMentionCharIndex,
  hasValidChars,
  hasValidMentionCharIndex,
  createMentionsList,
  createHashtagsList,
  parseMentionData,
  generatePlainText,
};
