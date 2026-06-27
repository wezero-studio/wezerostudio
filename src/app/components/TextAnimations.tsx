'use client';

import { useState, useEffect } from 'react';

export function AnimatedLetter({
  letter,
  revealed,
  autoSlice,
}: {
  letter: string;
  revealed: boolean;
  autoSlice: boolean;
}) {
  const [isSlicing, setIsSlicing] = useState(false);

  const handleMouseEnter = () => {
    if (!isSlicing) {
      setIsSlicing(true);
      setTimeout(() => setIsSlicing(false), 500);
    }
  };

  useEffect(() => {
    if (autoSlice && !isSlicing) {
      setIsSlicing(true);
      setTimeout(() => setIsSlicing(false), 500);
    }
  }, [autoSlice]); // eslint-disable-line react-hooks/exhaustive-deps -- adding isSlicing causes an infinite re-trigger

  return (
    <span
      className="relative inline-block"
      style={{ overflow: 'hidden', paddingBottom: '0.25em', marginBottom: '-0.25em' }}
    >
      <span
        className="inline-block"
        style={{
          transform: revealed ? 'translateY(0)' : 'translateY(115%)',
          transition: revealed ? 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
      >
        <span
          className="relative inline-block cursor-default"
          style={{
            overflow: 'hidden',
            paddingRight: '0.1em',
            marginRight: '-0.1em',
            paddingBottom: '0.3em',
            marginBottom: '-0.3em',
            transform: 'translateZ(0)',
          }}
          onMouseEnter={handleMouseEnter}
        >
          <span className={`inline-block transition-transform duration-500 ease-in-out ${isSlicing ? '-translate-x-[110%]' : 'translate-x-0'}`}>
            {letter}
          </span>
          <span
            className={`absolute left-0 top-0 inline-block transition-transform duration-500 ease-in-out text-[#1038CC] ${isSlicing ? 'translate-x-0' : 'translate-x-[250%]'}`}
            aria-hidden="true"
          >
            {letter}
          </span>
        </span>
      </span>
    </span>
  );
}

export function SliceDownText({ text, triggered }: { text: string; triggered: boolean }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(-115%)',
            transition: triggered ? `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 45}ms` : 'none',
          }}>
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </>
  );
}

export function SliceUpText({ text, triggered }: { text: string; triggered: boolean }) {
  let charIndex = 0;
  return (
    <>
      {text.split(' ').map((word, wordIdx, wordsArr) => {
        const wordNode = (
          <span key={`word-${wordIdx}`} style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((char, i) => {
              const currentI = charIndex++;
              return (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em', paddingTop: '0.15em', marginTop: '-0.15em', paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
                  <span style={{
                    display: 'inline-block',
                    transform: triggered ? 'translateY(0)' : 'translateY(115%)',
                    transition: triggered ? `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${currentI * 90}ms` : 'none',
                  }}>
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        );

        if (wordIdx < wordsArr.length - 1) {
          const spaceI = charIndex++;
          return (
            <span key={`frag-${wordIdx}`} style={{ display: 'inline' }}>
              {wordNode}
              <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em', paddingTop: '0.15em', marginTop: '-0.15em', paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
                <span style={{
                  display: 'inline-block',
                  transform: triggered ? 'translateY(0)' : 'translateY(115%)',
                  transition: triggered ? `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${spaceI * 90}ms` : 'none',
                }}>
                  &nbsp;
                </span>
              </span>
            </span>
          );
        }
        return wordNode;
      })}
    </>
  );
}

export function SliceUpWords({ text, triggered }: { text: string; triggered: boolean }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.15em', marginBottom: '-0.15em', marginRight: '0.25em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(115%)',
            transition: triggered ? `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms` : 'none',
          }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}
