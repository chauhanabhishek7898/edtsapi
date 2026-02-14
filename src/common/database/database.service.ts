import { Injectable, Logger } from '@nestjs/common';
import * as sql from 'mssql';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: sql.ConnectionPool;

  constructor() {
    this.initializePool();
  }

  private async initializePool(): Promise<void> {
    const config: sql.config = {
      server: process.env.DB_SERVER || 'DESKTOP-S6187CH',
      database: process.env.DB_NAME || 'BACARDI',
      user: process.env.DB_USER || 'nest',
      password: process.env.DB_PASSWORD || 'nest@123',
      options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 30000,
        requestTimeout: 30000
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };

    try {
      this.pool = new sql.ConnectionPool(config);
      await this.pool.connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Database connection failed', error.stack);
      throw error;
    }
  }

  async executeQuery(query: string): Promise<sql.IResult<any>> {
    try {
      const request = this.pool.request();
      return await request.query(query);
    } catch (error) {
      this.logger.error(`Query execution failed: ${query}`, error.stack);
      throw error;
    }
  }

  async executeStoredProcedure(procedureName: string, params?: any[]): Promise<any> {
    try {
      const request = this.pool.request();
      
      if (params) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }
      
      return await request.execute(procedureName);
    } catch (error) {
      this.logger.error(`Stored procedure execution failed: ${procedureName}`, error.stack);
      throw error;
    }
  }

  async executeScalar(query: string): Promise<any> {
    try {
      const result = await this.executeQuery(query);
      if (result.recordset && result.recordset.length > 0) {
        const firstRow = result.recordset[0];
        const firstColumn = Object.keys(firstRow)[0];
        return firstRow[firstColumn];
      }
      return null;
    } catch (error) {
      this.logger.error(`Scalar execution failed: ${query}`, error.stack);
      throw error;
    }
  }

  async executeNonQuery(query: string): Promise<number> {
    try {
      const result = await this.executeQuery(query);
      return result.rowsAffected[0];
    } catch (error) {
      this.logger.error(`Non-query execution failed: ${query}`, error.stack);
      throw error;
    }
  }

  async getDataTable(query: string): Promise<any[]> {
    try {
      const result = await this.executeQuery(query);
      return result.recordset;
    } catch (error) {
      this.logger.error(`Data table query failed: ${query}`, error.stack);
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.executeQuery('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.logger.log('Database connection closed');
    }
  }
}