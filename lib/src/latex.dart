import 'package:petitparser/petitparser.dart';
import 'package:math_expressions/math_expressions.dart';
import 'dart:math' as math;

/// 1. Tokenize input string
/// 2. Shunting yard

class LaTexParser  {
  String inputString;
  List outputstack = [];
  List operstack = [];
  List stream = [];
  final bool isRadMode;

  LaTexParser(this.inputString, {this.isRadMode = true}) {
    inputString = inputString.replaceAll(' ', '');
    tokenize();
    shuntingyard();
  }
  
  void tokenize() {
    /// types:
    /// b -> basic
    /// f -> function
    /// l -> left parenthesis
    /// r -> right parenthesis
    /// o+digit+(l) -> operator + precedence + (left-associativity)
    /// u -> other

    final integer = digit().plus().flatten();
    final number =
      ((integer | char('.').and()) &
      (char('.') & integer).pick(1).optional() &
      (char('E') & pattern('+-').optional() & integer).optional()).flatten().map(num.parse);
    final underline = (char('_') & digit().map(int.parse)).pick(1);
    final pi = string('\\pi').map((a)=>math.pi);
    final e = char('e').map((a)=>math.e);
    // final variable = pattern('xy');

    final basic = (number | underline | pi | e).map((v)=>[v, 'b']);

    final sqrt = (string('\\sqrt') & char('{').and()).map((v)=>['\\sqrt', 'f']);
    final nrt = (string('\\sqrt') & char('[').and()).map((v)=>['\\nrt', 'f']);
    final function = 
      ((string('\\sin') | string('\\cos') | string('\\tan') | string('\\arcsin') | string('\\arccos') | string('\\arctan') | string('\\ln') | string('\\log')).map((v)=>[v, 'f'])) | sqrt | nrt;
    
    final lp = (string('\\left(') | char('{') | string('\\left|') | char('[')).map((v)=>[v, 'l']);

    final rp = (string('\\right)') | char('}') | string('\\right|') | char(']')).map((v)=>[v, 'r']);

    final plus = char('+').map((v)=>[v, ['o', 2, 'l']]);

    final minus = char('-').map((v)=>[v, ['o', 2, 'l']]);

    final times = string('\\times').map((v)=>[v, ['o', 3, 'l']]);

    final divide = (string('\\frac') | string('\\div')).map((v)=>[v, ['o', 3, 'l']]);

    final expo = char('^').map((v)=>[v, ['o', 4, 'r']]);

    final factorial = char('!').map((v)=>[v, ['o', 5, 'l']]);

    final percent = string('\\%').map((v)=>[v, ['o', 5, 'l']]);

    final oper = plus | minus | times | divide | expo | factorial | percent;

    final other = char('_').map((v)=>[v, 'u']);

    final tokenize = (basic | function | lp | rp | oper | other).star().end();

    stream = tokenize.parse(inputString).value;
  }

  void shuntingyard() {
    for (var i = 0; i < stream.length; i++) {
      switch (stream[i][1]) {
        case 'b':
          if (i>0 && stream[i-1][1].contains(RegExp(r'b|r'))) {
            operstack.add(['\\times', ['o', 3, 'l']]);
          }
          outputstack.add(stream[i][0]);
          break;
        case 'f':
          if (i>0 && stream[i-1][1].contains(RegExp(r'b|r'))) {
            operstack.add(['\\times', ['o', 3, 'l']]);
          }
          operstack.add(stream[i]);
          break;
        case 'l':
          if (stream[i][0]=='\\left|') {
            operstack.add(['\\abs', 'f']);
          }
          if (i>0 && stream[i-1][1]=='b') {
            operstack.add(['\\times', ['o', 3, 'l']]);
          }
          operstack.add(stream[i]);
          break;
        case 'r':
          while (true) {
            if (operstack.length<=0) {
              break;
            }
            if (operstack.last[1]!='l') {
              outputstack.add(operstack.last[0]);
              operstack.removeLast();
              continue;
            } else {
              operstack.removeLast();
            }
            break;
          }
          break;
        case 'u':
          break;
        default:
          while (true) {
            if (operstack.length<=0) {
              break;
            }
            if (operstack.last[1]=='f') {
              outputstack.add(operstack.last[0]);
              operstack.removeLast();
              continue;
            }
            if (operstack.last[1] is List) {
              if (operstack.last[1][1] > stream[i][1][1]) {
                outputstack.add(operstack.last[0]);
                operstack.removeLast();
                continue;
              } else if (operstack.last[1][1] == stream[i][1][1] && operstack.last[1][2] == 'l') {
                outputstack.add(operstack.last[0]);
                operstack.removeLast();
                continue;
              }
            }
            break;
          }
          operstack.add(stream[i]);
      }
    }
    while (operstack.length>0) {
      outputstack.add(operstack.last[0]);
      operstack.removeLast();
    }
  }

  Expression parse() {
    List<Expression> result = <Expression>[];
    Expression left;
    Expression right;
    for (var i = 0; i < outputstack.length; i++) {
      switch (outputstack[i]) {
        case '+':
          right = result.removeLast();
          left = result.removeLast();
          result.add(left+right);
          break;
        case '-':
          right = result.removeLast();
          try {
            left = result.removeLast();
            result.add(left-right);
          } catch (e) {
            result.add(Number(0.0)-right);
          }
          break;
        case '\\times':
          right = result.removeLast();
          left = result.removeLast();
          result.add(left*right);
          break;
        case '\\div':
          right = result.removeLast();
          left = result.removeLast();
          result.add(left/right);
          break;
        case '\\frac':
          right = result.removeLast();
          left = result.removeLast();
          result.add(left/right);
          break;
        case '^':
          right = result.removeLast();
          left = result.removeLast();
          result.add(left^right);
          break;
        case '\\sin':
          if (isRadMode) {
            result.add(Sin(result.removeLast()));
          } else {
            result.add(Sin(result.removeLast()*Number(math.pi/180)));
          }
          break;
        case '\\cos':
          if (isRadMode) {
            result.add(Cos(result.removeLast()));
          } else {
            result.add(Cos(result.removeLast()*Number(math.pi/180)));
          }
          break;
        case '\\tan':
          if (isRadMode) {
            result.add(Tan(result.removeLast()));
          } else {
            result.add(Tan(result.removeLast()*Number(math.pi/180)));
          }
          break;
        case '\\arcsin':
          if (isRadMode) {
            result.add(Asin(result.removeLast()));
          } else {
            result.add(Asin(result.removeLast())*Number(180/math.pi));
          }
          break;
        case '\\arccos':
          if (isRadMode) {
            result.add(Acos(result.removeLast()));
          } else {
            result.add(Acos(result.removeLast())*Number(180/math.pi));
          }
          break;
        case '\\arctan':
          if (isRadMode) {
            result.add(Atan(result.removeLast()));
          } else {
            result.add(Atan(result.removeLast())*Number(180/math.pi));
          }
          break;
        case '\\ln':
          result.add(Ln(result.removeLast()));
          break;
        case '\\log':
          right = result.removeLast();
          left = result.removeLast();
          result.add(Log(left, right));
          break;
        case '\\sqrt':
          result.add(Root.sqrt(result.removeLast()));
          break;
        case '\\nrt':
          left = result.removeLast();
          right = result.removeLast();
          result.add(left^(Number(1.0)/right));
          break;
        case '\\abs':
          result.add(Abs(result.removeLast()));
          break;
        case '\\%':
          result.add(result.removeLast()/Number(100.0));
          break;
        case '!':
          try {
            num t = result.removeLast().evaluate(EvaluationType.REAL, ContextModel());
            if (t.ceil() == t.floor() && t>=0) {
              int a = t.toInt();
              int y = 1;
              while(a > 0) {
                y *= a;
                a--;
              }
              result.add(Number(y));
            } else {
              throw 'Unable to do factorial';
            }
          } catch (e) {}
          break;
        default:
          result.add(Number(outputstack[i]));
      }
    }
    assert(result.length==1);
    return result[0];
  }
  
}