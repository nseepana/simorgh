import clone from 'ramda/src/clone';
import pathOr from 'ramda/src/pathOr';
import path from 'ramda/src/path';
import paragraph from './blocks/paragraph';
import media from './blocks/media';
import legacyMedia from './blocks/legacyMedia';
import image from './blocks/image';
import list from './blocks/list';
import subheadline from './blocks/subheadline';
import version from './blocks/version';
import include from './blocks/include';
import socialEmbed from './blocks/socialEmbed';
import { UNSUPPORTED_BLOCK_TYPE } from '#lib/logger.const';

const nodeLogger = require('#lib/logger.node');

const logger = nodeLogger(__filename);

const handleMissingType = (block, json, assetType) =>
  logger.info(UNSUPPORTED_BLOCK_TYPE, {
    url: json.metadata.locators.assetUri,
    type: block.type,
    assetType,
  });

// Pass external_vpid blocks through to be filtered by processUnavailableMedia
// eslint-disable-next-line camelcase
const external_vpid = block => block;

const typesToConvert = {
  crosshead: subheadline,
  heading: subheadline,
  subheading: subheadline,
  image,
  paragraph,
  list,
  media,
  external_vpid,
  version,
  legacyMedia,
  include,
  social_embed: socialEmbed,
};

const parseBlockByType = (block, json, assetType) => {
  if (!path(['type'], block)) return false;

  const { type } = block;

  const parsedBlock = (typesToConvert[type] || handleMissingType)(
    block,
    json,
    assetType,
  );

  if (!parsedBlock) {
    return null;
  }

  return parsedBlock;
};

const convertToOptimoBlocks = async jsonRaw => {
  const json = clone(jsonRaw);

  const assetType = path(['metadata', 'type'], json);
  const blocks = pathOr([], ['content', 'blocks'], json);

  const parsedBlocks = await Promise.all(
    blocks.map(block => parseBlockByType(block, json, assetType)),
  );

  return {
    ...json,
    content: {
      model: {
        blocks: parsedBlocks.filter(Boolean),
      },
    },
  };
};

export default convertToOptimoBlocks;
