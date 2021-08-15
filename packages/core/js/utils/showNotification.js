import { arrayRemove } from './utils';
import UAParser from 'ua-parser-js';

const noteStore = {
  activeNotifications: []
};

const uaparser = UAParser();

export default function(song, mediaIcon) {
  let notification;
  if (navigator.mediaSession) {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album,
      artwork: [{ src: mediaIcon, sizes: '192x192', type: 'image/jpeg' }]
    });
    if (uaparser.os.name === 'Android') return; // don't use notifications , use media session api
  }
  try {
    if (uaparser.browser.name === 'Firefox') return;
    const title = song.title;
    const body = song.artist + '\n' + song.album;

    // Let's check if the browser supports notifications
    if (!window.Notification) {
      console.log('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      // Let's check if the user is okay to get some notification
      // If it's okay let's create a notification
      notification = new Notification(title, {
        body: body,
        icon: mediaIcon,
        tag: 'subfire-m',
        silent: true
      });
    } else if (Notification.permission !== 'denied') {
      // Otherwise, we need to ask the user for permission
      Notification.requestPermission(function(permission) {
        // If the user is okay, let's create a notification
        if (permission === 'granted') {
          notification = new Notification(title, {
            body: body,
            icon: mediaIcon,
            tag: 'subfire-m',
            silent: true
          });
        }
      });
    }
    // close it after 5 seconds
    console.log('new note', notification, noteStore);
    if (notification) noteStore.activeNotifications.push(notification);
    if (notification)
      setTimeout(function() {
        arrayRemove(noteStore.activeNotifications, notification);
        notification.close();
      }, 5000);
  } catch (e) {
    console.error(e);
  }
}
