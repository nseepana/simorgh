import {
  runCommonCrossPlatformTests,
  runMediaPlayerEmbedTests,
} from '../../common';

export default () => {
  runCommonCrossPlatformTests();
  runMediaPlayerEmbedTests();

  it('I can see the headline', () => {
    const h1El = document.querySelector('h1');

    expect(h1El).toBeInTheDocument();
    expect(h1El).toBeTruthy();
    expect(h1El.textContent).toMatchSnapshot();
  });

  it('I can see the summary', () => {
    const summaryEl = document.querySelector('main p');

    expect(summaryEl).toBeInTheDocument();
    expect(summaryEl).toBeTruthy();
    expect(summaryEl.textContent).toMatchSnapshot();
  });
};
