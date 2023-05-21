import * as Case from 'case';

export interface CaseObject {
    camel: typeof Case.camel;
    capital: typeof Case.capital;
    constant: typeof Case.constant;
    header: typeof Case.header;
    kebab: typeof Case.kebab;
    lower: typeof Case.lower;
    pascal: typeof Case.pascal;
    sentence: typeof Case.sentence;
    snake: typeof Case.snake;
    title: typeof Case.title;
    upper: typeof Case.upper;
    of: typeof Case.of;
  }