import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface AttemptRecord {
  attempts: number;
  lastAttempt: number;
}

class AuthProtection {
  private attempts: Map<string, AttemptRecord>;
  private filePath: string;

  constructor() {
    this.attempts = new Map();
    this.filePath = path.join(process.cwd(), 'auth-attempts.json');
    this.loadAttemptsFromFile();
    this.startCleanupInterval();
  }

  private async loadAttemptsFromFile() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      this.attempts = new Map(Object.entries(jsonData));
    } catch (error) {
      console.error('Error loading attempts from file:', error);
    }
  }

  private async saveAttemptsToFile() {
    try {
      const jsonData = JSON.stringify(Object.fromEntries(this.attempts));
      await fs.writeFile(this.filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error('Error saving attempts to file:', error);
    }
  }

  private startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of Array.from(this.attempts.entries())) {
        if (now - record.lastAttempt > LOCKOUT_TIME) {
          this.attempts.delete(key);
        }
      }
      this.saveAttemptsToFile();
    }, CLEANUP_INTERVAL);
  }

  private generateKey(ip: string, username: string, userAgent: string): string {
    const data = `${ip}:${userAgent}`;
    return createHash('sha256').update(data).digest('hex');
  }

  async checkAttempts(ip: string, username: string, userAgent: string): Promise<string | null> {
    const key = this.generateKey(ip, username, userAgent);
    const record = this.attempts.get(key) || { attempts: 0, lastAttempt: 0 };
    const now = Date.now();

    if (now - record.lastAttempt > LOCKOUT_TIME) {
      record.attempts = 1;
    } else {
      record.attempts++;
    }

    record.lastAttempt = now;
    this.attempts.set(key, record);
    await this.saveAttemptsToFile();

    if (record.attempts > MAX_ATTEMPTS) {
      const remainingTime = Math.ceil((LOCKOUT_TIME - (now - record.lastAttempt)) / 60000);
      return `Too many attempts. Try again in ${remainingTime} minutes.`;
    }

    return null;
  }
}

export const authProtection = new AuthProtection();