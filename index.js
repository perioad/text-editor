let list = $('.documents__list');
const prefixName = 'documentName_';
const prefixText = 'documentText_';
const splitter = '_';
let documentId;

const createListItem = (id, name) => {
  $('<li></li>').addClass('documents__item')
                .attr('data-itemid', `${prefixName}${id}`)
                .text(name)
                .appendTo(list);
};

document.addEventListener('keyup', () => {
    localStorage.setItem(`${prefixText}${documentId}`, document.querySelector('.editor__text-field').innerHTML);
});

const showDocuments = () => {
  const storageSize = localStorage.length;
  
  if (storageSize > 0) {
    for (let i = 0; i < storageSize; i += 1) {
      const key = localStorage.key(i);
      
      if (key.indexOf(prefixName) === 0) {
        const [, id] = key.split(splitter);
        documentId = id;

        createListItem(id, localStorage.getItem(key));
      }
    }
  }
};

showDocuments();

$('.documents__input').on('keyup', (event) => {
  if (event.keyCode !== 13) {
    return;
  }

  const inputValue = event.target.value;
  event.target.value = '';

  if (inputValue.length > 0) {
    let numberId = 0;

    list.children().each((index, element) => {
      const [, elementId] = $(element).attr('data-itemid').split(splitter);

      if (Number(elementId) > numberId) {
        numberId = Number(elementId);
      }
    })
    numberId += 1;

    localStorage.setItem(`${prefixName}${numberId}`, inputValue);

    documentId = numberId;

    localStorage.setItem(`${prefixText}${documentId}`, '');

    document.querySelector('.editor__text-field').innerHTML = '';
    document.querySelector('.editor__text-field').style.visibility = 'visible';

    createListItem(numberId, inputValue);

    document.querySelector('.header').innerHTML = localStorage.getItem(`${prefixName}${documentId}`);
  }
});

$(document).on('click', '.documents__item', (event) => {
  const clickedItem = $(event.target);
  const [, id] = clickedItem.attr('data-itemid').split(splitter);
  
  if (event.altKey) {
    localStorage.removeItem(clickedItem.attr('data-itemid'));
    localStorage.removeItem(`${prefixText}${id}`);
    
    document.querySelector('.editor__text-field').innerHTML = '';
    document.querySelector('.editor__text-field').style.visibility = 'hidden';
    document.querySelector('.header').innerHTML = 'Text editor with autosave';

    clickedItem.remove();

    return true;
  }

  documentId = id;

  $('.documents__item--active').each((index, element) => $(element).removeClass('documents__item--active'));
  clickedItem.addClass('documents__item--active');
  document.querySelector('.editor__text-field').innerHTML = localStorage.getItem(`${prefixText}${documentId}`);
  document.querySelector('.editor__text-field').style.visibility = 'visible';
  document.querySelector('.header').innerHTML = localStorage.getItem(`${prefixName}${documentId}`);
});