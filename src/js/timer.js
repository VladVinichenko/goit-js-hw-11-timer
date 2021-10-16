const refs = {
  body: document.querySelector('body'),
  data: document.querySelector('[data-value="data"]'),
  start: document.querySelector('[data-action="start"]'),
  timerBox: document.querySelector('.timer__box'),
  formBox: document.querySelector('.form-box'),
};

class CountdownTimer {
  constructor(setTime) {
    this.selector = setTime.selector;
    this.time = setTime.targetDate.getTime();
    this.timerRefs = {
      days: document.querySelector(`${this.selector}`).querySelector('[data-value="days"]'),
      hours: document.querySelector(`${this.selector}`).querySelector('[data-value="hours"]'),
      mins: document.querySelector(`${this.selector}`).querySelector('[data-value="mins"]'),
      secs: document.querySelector(`${this.selector}`).querySelector('[data-value="secs"]'),
    };
    this.started = false; //started timer
    this.timerId = null;
    this.changeTime = null;
    this.oldvalues = {};
    this.nowDate = Date.now();
    this.start();
  }

  start() {
    if (!this.started) {
      this.timerId = setInterval(() => {
        this.newValue();
      }, 1000);
      this.started = true;
      return;
    }
  }
  newValue() {
    if (Date.now() < this.time) {
      this.changeTime = this.time - Date.now();
      // console.log(this.changeTime); //==============change time
      this.updateTime(this.changeTime);
      return;
    }
    clearInterval(this.timerId);
    this.started = false;
    // console.log('timer-stop', `${this.time}`);
    return;
  }
  pad(value) {
    return String(value).padStart(2, '0');
  }

  getValue(days, hours, mins, secs) {
    this.timerRefs.days.innerHTML = days;
    this.timerRefs.hours.innerHTML = hours;
    this.timerRefs.mins.innerHTML = mins;
    this.timerRefs.secs.innerHTML = secs;
  }

  timeactive(days, hours, mins, secs) {
    //checker changes values
    if (days !== this.oldvalues.days) {
      this.adaptiveList(this.timerRefs.days);
    }
    if (hours !== this.oldvalues.hours) {
      this.adaptiveList(this.timerRefs.hours);
    }
    if (mins !== this.oldvalues.mins) {
      this.adaptiveList(this.timerRefs.mins);
    }
    if (secs !== this.oldvalues.secs) {
      this.adaptiveList(this.timerRefs.secs);
    }

    this.oldvalues.days = days;
    this.oldvalues.hours = hours;
    this.oldvalues.mins = mins;
    this.oldvalues.secs = secs;
  }

  adaptiveList(rel) {
    //add and remove active class (.field_click)
    rel.parentNode.classList.add('field_click');
    const timerTick = setTimeout(timeOutTick, 150);
    function timeOutTick() {
      clearTimeout(timerTick);
      rel.parentNode.classList.remove('field_click');
    }
  }

  updateTime(currentTime) {
    //formatting UNIX time to dd.. hh mm ss
    const days = this.pad(Math.floor(currentTime / (1000 * 60 * 60 * 24)));
    const hours = this.pad(Math.floor((currentTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = this.pad(Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((currentTime % (1000 * 60)) / 1000));
    this.getValue(days, hours, mins, secs);
    this.timeactive(days, hours, mins, secs);
  }
}

function timer() {
  let started = false; //is started

  refs.data.addEventListener('change', changeData);

  function changeData() {
    //action to change data in form
    if (Date.now() < refs.data.valueAsNumber) {
      //comparing two dates(now and input)
      refs.start.removeAttribute('disabled');
      refs.start.addEventListener('click', start);
      return;
    }
    refs.start.setAttribute('disabled', true);
    refs.start.removeEventListener('click', start);
  }

  function start() {
    if (!started) {
      started = true;
      isHiddenReplacer(refs.formBox, refs.timerBox);
      refs.start.setAttribute('disabled', true);
      //=========of class
      new CountdownTimer({
        selector: '#timer-1',
        targetDate: new Date(refs.data.valueAsNumber),
      });
      //=========of class
    }
  }

  function isHiddenReplacer(add, remove) {
    remove.classList.remove('is-hide');
    add.classList.add('is-hide');
  }

  function initPage() {
    //start settings on download page
    refs.start.setAttribute('disabled', true);
  }

  initPage(); //set start settings on download page
}

timer(); //start script.
