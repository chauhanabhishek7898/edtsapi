export class StringUtils {
  static truncate(str: string, maxLength: number): string {
    str = str || '';
    return str.length <= maxLength ? str : str.substring(0, maxLength);
  }

  static right(str: string, length: number): string {
    str = str || '';
    return str.substring(str.length - Math.min(str.length, length));
  }

  static left(str: string, length: number): string {
    str = str || '';
    return str.substring(0, Math.min(length, str.length));
  }

  static mid(str: string, startIndex: number, length: number): string {
    str = str || '';
    if (startIndex <= str.length) {
      return str.substring(startIndex, Math.min(startIndex + length, str.length));
    }
    return str.substring(0, Math.min(length, str.length));
  }

  static between(strSource: string, strStart: string, strEnd: string): string {
    strSource = strSource || '';
    
    if (strSource.includes(strStart) && strSource.includes(strEnd)) {
      const start = strSource.indexOf(strStart);
      const end = strSource.indexOf(strEnd, start);
      return strSource.substring(start, end);
    } else if (strSource.includes(strStart)) {
      return strSource.substring(strSource.indexOf(strStart));
    } else if (strSource.includes(strEnd)) {
      return strSource.substring(strSource.indexOf(strEnd));
    }
    return '';
  }

  static convertNullToString(obj: any): any {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        obj[key] = this.convertNullToString(obj[key]);
      });
    }
    return obj;
  }
}