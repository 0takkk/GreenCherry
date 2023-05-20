import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import Image from 'next/image';

import style from './index.module.scss';

const InstallPrompt = () => {
  const [isShown, setIsShown] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Detect if the device is an iOS device
    const isDeviceIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isDeviceIOS);

    window.addEventListener('beforeinstallprompt', e => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsShown(true);
    });
  }, []);

  const handleClick = async () => {
    setIsShown(false);
    if (!deferredPrompt) {
      return;
    }
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsShown(false);
  };

  if (!isShown) {
    return null;
  }

  return (
    <>
      <div className={style.backdrop} />
      <div className={style['install-prompt']}>
        {isIOS ? (
          <p>
            Please use the &quot;Add to Home Screen&quot; option in your browser
            menu to install this app.
          </p>
        ) : (
          <div className={style['install-container']}>
            <Image
              src="/assets/logo/cherryLogoShadowRemove.svg"
              width={69}
              height={69}
              alt="greencherry main logo"
            />
            <div className="text-center">
              <span className="text-secondary font-bold">GreenCherry</span>
              는 앱을 지원합니다.
              <br />
              <span className="text-xl">설치하시겠습니까?</span>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className={style['install-btn']}
            >
              Install App
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleClose}
          className={style['close-btn']}
        >
          <AiOutlineClose size={24} />
        </button>
      </div>
    </>
  );
};

export default InstallPrompt;
