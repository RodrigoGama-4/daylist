import rx from 'rxjs';

const obs = new rx.Subject();
setTimeout(() => {
  obs.next({
    key: 'davi',
  });
  obs.next({
    key: 'alexandre',
  });
  obs.next({
    key: 'deltree',
  });
}, 1000);

const observe = obs.pipe(rx.debounceTime(1000));
const sub = observe.subscribe(console.log);
