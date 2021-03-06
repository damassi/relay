/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @emails oncall+relay
 */

'use strict';

const FlattenTransform = require('../FlattenTransform');
const GraphQLCompilerContext = require('../../core/GraphQLCompilerContext');
const InlineFragmentsTransform = require('../InlineFragmentsTransform');
const RelayGenerateTypeNameTransform = require('../RelayGenerateTypeNameTransform');
const RelayParser = require('../../core/RelayParser');
const Schema = require('../../core/Schema');

const {
  TestSchema,
  generateTestsFromFixtures,
} = require('relay-test-utils-internal');

describe('RelayGenerateTypeNameTransform', () => {
  generateTestsFromFixtures(
    `${__dirname}/fixtures/generate-typename-transform`,
    text => {
      const compilerSchema = Schema.DEPRECATED__create(TestSchema);
      const ast = RelayParser.parse(compilerSchema, text);
      return new GraphQLCompilerContext(compilerSchema)
        .addAll(ast)
        .applyTransforms([
          InlineFragmentsTransform.transform,
          FlattenTransform.transformWithOptions({flattenAbstractTypes: true}),
          RelayGenerateTypeNameTransform.transform,
        ])
        .documents()
        .map(doc => JSON.stringify(doc, null, 2))
        .join('\n');
    },
  );
});
