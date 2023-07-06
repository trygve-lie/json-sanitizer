import assert from 'node:assert/strict';
import { test } from 'node:test';

import replacer from '../src/main.js';

test('Non malicious - Structure is an Object', (t) => {
    const source = {foo: 'bar'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.deepEqual(result, source, 'Should be same Object value as source');
});

test('Non malicious - Structure is an Array', (t) => {
    const source = ['foo', 'bar'];

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.deepEqual(result, source, 'Should be same Array value as source');
});

test('Non malicious - Structure is an deep Object structure', (t) => {
    const source = {
        foo: [
            {foo: 'bar'},
            {bar: 'foo'},
            {xyz: {
                foo: 'bar'
            }}
        ]
    };

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.deepEqual(result, source, 'Should be same deep Object structure as source');
});

test('Non malicious - Values are sane types', (t) => {
    const source = {
        boolean: true,
        string: 'string',
        number: 1,
        object: {},
        array: [],
        null: null,
    };

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.boolean, source.boolean, 'Should be same Boolean value as source');
    assert.equal(result.string, source.string, 'Should be same String value as source');
    assert.equal(result.number, source.number, 'Should be same Number value as source');
    assert.deepEqual(result.object, source.object, 'Should be same Object value as source');
    assert.deepEqual(result.array, source.array, 'Should be same Array value as source');
    assert.equal(result.null, source.null, 'Should be same Null value as source');
});

test('Non malicious - Keys are sane types', (t) => {
    const source = {
        key: 'string',
        [1]: 'number',
        [true]: 'boolean',
    };

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result['key'], source['key'], 'Should be same String key as source');
    assert.equal(result[1], source[1], 'Should be same Number key as source');
    assert.equal(result[true], source[true], 'Should be same Boolean key as source');
});

test('Malicious - Value contains "<"', (t) => {
    const source = {key: '<'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.key, '\\u003C', 'Should be \\u003C');
});


test('Malicious - Value contains ">"', (t) => {
    const source = {key: '>'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.key, '\\u003E', 'Should be \\u003E');
});

test('Malicious - Value contains "/"', (t) => {
    const source = {key: '/'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.key, '\\u002F', 'Should be \\u002F');
});

test('Malicious - Value contains "\/u2028"', (t) => {
    const source = {key: '\u2028'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.key, '\\u2028', 'Should be \\u2028');
});

test('Malicious - Value contains "\/u2029"', (t) => {
    const source = {key: '\u2029'};

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.equal(result.key, '\\u2029', 'Should be \\u2029');
});

test('Malicious - Array with malicious markup', (t) => {
    const source = [
        '</script><script>alert("pawned");</script>',
        '<img src=0 onerror=\"alert(\"pawned\")\">',
    ];

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.deepEqual(result, [ 
        '\\u003C\\u002Fscript\\u003E\\u003Cscript\\u003Ealert("pawned");\\u003C\\u002Fscript\\u003E',
        '\\u003Cimg src=0 onerror="alert("pawned")"\\u003E',
    ], 'Should be escaped');
});

test('Malicious - Object with malicious markup', (t) => {
    const source = { 
        keya: '</script><script>alert("pawned");</script>',
        keyb: '<img src=0 onerror=\"alert(\"pawned\")\">',
    };

    const str = JSON.stringify(source, replacer());
    const result = JSON.parse(str);

    assert.deepEqual(result, { 
        keya: '\\u003C\\u002Fscript\\u003E\\u003Cscript\\u003Ealert("pawned");\\u003C\\u002Fscript\\u003E',
        keyb: '\\u003Cimg src=0 onerror="alert("pawned")"\\u003E',
    }, 'Should be escaped');
});
