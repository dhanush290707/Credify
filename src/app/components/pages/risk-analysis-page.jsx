import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import { Modal } from '../modal';
import {
  AlertTriangle, Shield, TrendingDown, Target,
  Activity, Zap, AlertCircle, CheckCircle, XCircle,
  Download, RefreshCw, BarChart3 } from
'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, ScatterChart, Scatter,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from
'recharts';

export function RiskAnalysisPage() {
  const { loans, users, payments, transactions } = useApp();
  const [riskView, setRiskView] = useState('overview');
  const [selectedLoan, setSelectedLoan] = useState(null);

  // ===== RISK SCORING ENGINE =====

  const calculateRiskScore = (loan) => {
    let score = 100; // Start with perfect score

    // Credit Score Impact (40%)
    const creditScore = loan.creditScore || 0;
    if (creditScore < 580) score -= 40;else
    if (creditScore < 620) score -= 30;else
    if (creditScore < 680) score -= 20;else
    if (creditScore < 740) score -= 10;else
    if (creditScore < 800) score -= 5;

    // Loan Amount Impact (20%)
    if (loan.amount > 100000) score -= 20;else
    if (loan.amount > 75000) score -= 15;else
    if (loan.amount > 50000) score -= 10;else
    if (loan.amount > 25000) score -= 5;

    // Duration Impact (15%)
    if (loan.duration > 60) score -= 15;else
    if (loan.duration > 48) score -= 10;else
    if (loan.duration > 36) score -= 7;else
    if (loan.duration > 24) score -= 5;

    // Interest Rate Impact (15%)
    if (loan.interestRate > 12) score -= 15;else
    if (loan.interestRate > 10) score -= 10;else
    if (loan.interestRate > 8) score -= 5;

    // Employment Status Impact (10%)
    if (!loan.employmentStatus || loan.employmentStatus === 'unemployed') score -= 10;else
    if (loan.employmentStatus === 'part-time') score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const getRiskCategory = (score) =>




  {
    if (score >= 85) return {
      category: 'minimal',
      color: '#22c55e',
      label: 'Minimal Risk',
      action: 'Auto-Approve'
    };
    if (score >= 70) return {
      category: 'low',
      color: '#84cc16',
      label: 'Low Risk',
      action: 'Standard Approval'
    };
    if (score >= 55) return {
      category: 'moderate',
      color: '#eab308',
      label: 'Moderate Risk',
      action: 'Manual Review'
    };
    if (score >= 40) return {
      category: 'high',
      color: '#f97316',
      label: 'High Risk',
      action: 'Enhanced Due Diligence'
    };
    return {
      category: 'critical',
      color: '#ef4444',
      label: 'Critical Risk',
      action: 'Recommend Reject'
    };
  };

  // Calculate risk scores for all loans
  const loansWithRisk = loans.map((loan) => ({
    ...loan,
    riskScore: calculateRiskScore(loan),
    riskCategory: getRiskCategory(calculateRiskScore(loan))
  }));

  // ===== PORTFOLIO RISK METRICS =====

  const totalExposure = loans.filter((l) => l.status === 'active').reduce((sum, l) => sum + l.amount, 0);
  const weightedAvgRisk = loansWithRisk.reduce((sum, l) => {
    const weight = l.amount / totalExposure;
    return sum + l.riskScore * weight;
  }, 0);

  // Risk Distribution
  const riskDistribution = [
  {
    category: 'Minimal',
    count: loansWithRisk.filter((l) => l.riskScore >= 85).length,
    exposure: loansWithRisk.filter((l) => l.riskScore >= 85).reduce((sum, l) => sum + l.amount, 0),
    color: '#22c55e'
  },
  {
    category: 'Low',
    count: loansWithRisk.filter((l) => l.riskScore >= 70 && l.riskScore < 85).length,
    exposure: loansWithRisk.filter((l) => l.riskScore >= 70 && l.riskScore < 85).reduce((sum, l) => sum + l.amount, 0),
    color: '#84cc16'
  },
  {
    category: 'Moderate',
    count: loansWithRisk.filter((l) => l.riskScore >= 55 && l.riskScore < 70).length,
    exposure: loansWithRisk.filter((l) => l.riskScore >= 55 && l.riskScore < 70).reduce((sum, l) => sum + l.amount, 0),
    color: '#eab308'
  },
  {
    category: 'High',
    count: loansWithRisk.filter((l) => l.riskScore >= 40 && l.riskScore < 55).length,
    exposure: loansWithRisk.filter((l) => l.riskScore >= 40 && l.riskScore < 55).reduce((sum, l) => sum + l.amount, 0),
    color: '#f97316'
  },
  {
    category: 'Critical',
    count: loansWithRisk.filter((l) => l.riskScore < 40).length,
    exposure: loansWithRisk.filter((l) => l.riskScore < 40).reduce((sum, l) => sum + l.amount, 0),
    color: '#ef4444'
  }];


  // Default Probability Estimation
  const estimateDefaultProbability = (riskScore) => {
    if (riskScore >= 85) return 0.5;
    if (riskScore >= 70) return 1.5;
    if (riskScore >= 55) return 4.0;
    if (riskScore >= 40) return 8.5;
    return 15.0;
  };

  const portfolioDefaultRate = loansWithRisk.reduce((sum, l) => {
    const weight = l.amount / totalExposure;
    return sum + estimateDefaultProbability(l.riskScore) * weight;
  }, 0);

  const expectedLoss = totalExposure * (portfolioDefaultRate / 100) * 0.6; // 60% loss given default

  // ===== CONCENTRATION RISK =====

  // By Borrower
  const borrowerExposure = loans.reduce((acc, loan) => {
    acc[loan.borrowerName] = (acc[loan.borrowerName] || 0) + loan.amount;
    return acc;
  }, {});

  const concentrationByBorrower = Object.entries(borrowerExposure).
  map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / totalExposure * 100).toFixed(1)
  })).
  sort((a, b) => b.amount - a.amount).
  slice(0, 10);

  // By Purpose
  const purposeExposure = loans.reduce((acc, loan) => {
    acc[loan.purpose] = (acc[loan.purpose] || 0) + loan.amount;
    return acc;
  }, {});

  const concentrationByPurpose = Object.entries(purposeExposure).
  map(([purpose, amount]) => ({
    purpose,
    amount,
    percentage: (amount / totalExposure * 100).toFixed(1)
  })).
  sort((a, b) => b.amount - a.amount);

  // ===== PAYMENT RISK ANALYSIS =====

  const overduePayments = payments.filter((p) => {
    return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
  });

  const overdueAmount = overduePayments.reduce((sum, p) => sum + p.amount, 0);
  const delinquencyRate = (overduePayments.length / payments.length * 100).toFixed(2);

  // Days Past Due Analysis
  const dpd30 = overduePayments.filter((p) => {
    const daysOverdue = Math.floor((new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysOverdue >= 30;
  }).length;

  const dpd60 = overduePayments.filter((p) => {
    const daysOverdue = Math.floor((new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysOverdue >= 60;
  }).length;

  const dpd90 = overduePayments.filter((p) => {
    const daysOverdue = Math.floor((new Date().getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysOverdue >= 90;
  }).length;

  // ===== CREDIT RISK METRICS =====

  const avgCreditScore = loans.filter((l) => l.creditScore).reduce((sum, l) => sum + (l.creditScore || 0), 0) /
  loans.filter((l) => l.creditScore).length;

  const creditScoreDistribution = [
  { range: '300-579', count: loans.filter((l) => l.creditScore && l.creditScore < 580).length, risk: 'Critical' },
  { range: '580-619', count: loans.filter((l) => l.creditScore && l.creditScore >= 580 && l.creditScore < 620).length, risk: 'High' },
  { range: '620-679', count: loans.filter((l) => l.creditScore && l.creditScore >= 620 && l.creditScore < 680).length, risk: 'Medium-High' },
  { range: '680-739', count: loans.filter((l) => l.creditScore && l.creditScore >= 680 && l.creditScore < 740).length, risk: 'Medium' },
  { range: '740-799', count: loans.filter((l) => l.creditScore && l.creditScore >= 740 && l.creditScore < 800).length, risk: 'Low' },
  { range: '800-850', count: loans.filter((l) => l.creditScore && l.creditScore >= 800).length, risk: 'Minimal' }];


  // ===== STRESS TEST SCENARIOS =====

  const stressScenarios = [
  {
    scenario: 'Base Case',
    defaultRate: portfolioDefaultRate,
    expectedLoss: expectedLoss,
    severity: 'normal'
  },
  {
    scenario: 'Mild Recession',
    defaultRate: portfolioDefaultRate * 1.5,
    expectedLoss: expectedLoss * 1.5,
    severity: 'warning'
  },
  {
    scenario: 'Severe Recession',
    defaultRate: portfolioDefaultRate * 2.5,
    expectedLoss: expectedLoss * 2.5,
    severity: 'danger'
  },
  {
    scenario: 'Financial Crisis',
    defaultRate: portfolioDefaultRate * 4,
    expectedLoss: expectedLoss * 4,
    severity: 'critical'
  }];


  // ===== RISK INDICATORS =====

  const riskIndicators = [
  {
    metric: 'Portfolio Health',
    score: Math.round(weightedAvgRisk),
    benchmark: 70,
    status: weightedAvgRisk >= 70 ? 'good' : weightedAvgRisk >= 55 ? 'warning' : 'poor'
  },
  {
    metric: 'Credit Quality',
    score: Math.round(avgCreditScore / 850 * 100),
    benchmark: 80,
    status: avgCreditScore >= 680 ? 'good' : avgCreditScore >= 620 ? 'warning' : 'poor'
  },
  {
    metric: 'Payment Performance',
    score: Math.round(100 - parseFloat(delinquencyRate)),
    benchmark: 95,
    status: parseFloat(delinquencyRate) < 5 ? 'good' : parseFloat(delinquencyRate) < 10 ? 'warning' : 'poor'
  },
  {
    metric: 'Diversification',
    score: 75, // Mock calculation
    benchmark: 70,
    status: 'good'
  }];


  // ===== RISK SCATTER PLOT DATA =====

  const riskScatterData = loansWithRisk.map((loan) => ({
    amount: loan.amount,
    riskScore: loan.riskScore,
    creditScore: loan.creditScore || 0,
    interestRate: loan.interestRate,
    borrower: loan.borrowerName,
    id: loan.id
  }));

  // Export risk report
  const exportRiskReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      executiveSummary: {
        totalExposure,
        weightedAvgRisk: weightedAvgRisk.toFixed(2),
        portfolioDefaultRate: portfolioDefaultRate.toFixed(2),
        expectedLoss: expectedLoss.toFixed(2),
        delinquencyRate
      },
      riskDistribution,
      concentrationRisk: {
        byBorrower: concentrationByBorrower,
        byPurpose: concentrationByPurpose
      },
      creditMetrics: {
        avgCreditScore: avgCreditScore.toFixed(0),
        distribution: creditScoreDistribution
      },
      paymentRisk: {
        overduePayments: overduePayments.length,
        overdueAmount,
        dpd30,
        dpd60,
        dpd90
      },
      stressTests: stressScenarios,
      loanRiskScores: loansWithRisk.map((l) => ({
        id: l.id,
        borrower: l.borrowerName,
        amount: l.amount,
        riskScore: l.riskScore,
        category: l.riskCategory.label
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `risk_analysis_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Risk analysis report exported!');
  };

  const selectedLoanData = selectedLoan ? loansWithRisk.find((l) => l.id === selectedLoan) : null;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Risk Analysis & Management</h1>
          <p className="text-muted-foreground">Comprehensive risk assessment and monitoring</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={exportRiskReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setRiskView('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          riskView === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <BarChart3 size={18} />
          Overview
        </button>
        <button
          onClick={() => setRiskView('credit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          riskView === 'credit' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Shield size={18} />
          Credit Risk
        </button>
        <button
          onClick={() => setRiskView('concentration')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          riskView === 'concentration' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Target size={18} />
          Concentration
        </button>
        <button
          onClick={() => setRiskView('stress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          riskView === 'stress' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Zap size={18} />
          Stress Testing
        </button>
      </div>

      {/* OVERVIEW VIEW */}
      {riskView === 'overview' &&
      <>
          {/* Key Risk Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Exposure</p>
                <Activity className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl mb-2">${(totalExposure / 1000000).toFixed(2)}M</p>
              <p className="text-sm text-muted-foreground">{loans.filter((l) => l.status === 'active').length} active loans</p>
            </Card>

            <Card className={`p-6 border-l-4 ${
          weightedAvgRisk >= 70 ? 'border-l-green-500' :
          weightedAvgRisk >= 55 ? 'border-l-yellow-500' :
          'border-l-red-500'}`
          }>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Portfolio Risk Score</p>
                <Shield className={
              weightedAvgRisk >= 70 ? 'text-green-600' :
              weightedAvgRisk >= 55 ? 'text-yellow-600' :
              'text-red-600'
              } size={20} />
              </div>
              <p className="text-3xl mb-2">{weightedAvgRisk.toFixed(1)}/100</p>
              <p className={`text-sm ${
            weightedAvgRisk >= 70 ? 'text-green-600' :
            weightedAvgRisk >= 55 ? 'text-yellow-600' :
            'text-red-600'}`
            }>
                {weightedAvgRisk >= 70 ? 'Low Risk' : weightedAvgRisk >= 55 ? 'Moderate Risk' : 'High Risk'}
              </p>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Expected Default Rate</p>
                <TrendingDown className="text-yellow-600" size={20} />
              </div>
              <p className="text-3xl mb-2">{portfolioDefaultRate.toFixed(2)}%</p>
              <p className="text-sm text-muted-foreground">Expected loss: ${(expectedLoss / 1000).toFixed(0)}K</p>
            </Card>

            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Delinquency Rate</p>
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <p className="text-3xl mb-2">{delinquencyRate}%</p>
              <p className="text-sm text-red-600">{overduePayments.length} overdue payments</p>
            </Card>
          </div>

          {/* Risk Indicators Radar */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Portfolio Risk Indicators</h3>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={riskIndicators}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Current Score" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="mb-4">Risk Distribution by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {riskDistribution.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Exposure by Risk Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="exposure" radius={[8, 8, 0, 0]}>
                    {riskDistribution.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Risk Scatter Plot */}
          <Card className="p-6">
            <h3 className="mb-4">Loan Risk Profile (Amount vs Risk Score)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="amount" name="Loan Amount" stroke="#64748b" />
                <YAxis dataKey="riskScore" name="Risk Score" stroke="#64748b" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Loans" data={riskScatterData} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </Card>
        </>
      }

      {/* CREDIT RISK VIEW */}
      {riskView === 'credit' &&
      <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Average Credit Score</p>
              <p className="text-4xl mb-2">{avgCreditScore.toFixed(0)}</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                className="h-full bg-blue-500"
                style={{ width: `${avgCreditScore / 850 * 100}%` }} />
              
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">High Risk Loans</p>
              <p className="text-4xl mb-2">{loansWithRisk.filter((l) => l.riskScore < 55).length}</p>
              <p className="text-sm text-red-600">Require immediate attention</p>
            </Card>

            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Low Risk Loans</p>
              <p className="text-4xl mb-2">{loansWithRisk.filter((l) => l.riskScore >= 70).length}</p>
              <p className="text-sm text-green-600">Performing well</p>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <h3 className="mb-4">Credit Score Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={creditScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {creditScoreDistribution.map((entry, index) => {
                  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#22c55e'];
                  return <Cell key={`cell-${index}`} fill={colors[index]} />;
                })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Individual Loan Risk Scores */}
          <Card className="p-6">
            <h3 className="mb-4">Individual Loan Risk Assessment</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Loan ID</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Borrower</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Credit Score</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Risk Score</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Risk Category</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loansWithRisk.sort((a, b) => a.riskScore - b.riskScore).map((loan) =>
                <tr key={loan.id} className="border-b border-border hover:bg-secondary/50">
                      <td className="py-3 px-4 text-sm font-medium">{loan.id}</td>
                      <td className="py-3 px-4 text-sm">{loan.borrowerName}</td>
                      <td className="py-3 px-4 text-sm">${loan.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{loan.creditScore || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                          className="h-full"
                          style={{
                            width: `${loan.riskScore}%`,
                            backgroundColor: loan.riskCategory.color
                          }} />
                        
                          </div>
                          <span className="text-sm font-medium">{loan.riskScore.toFixed(0)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${loan.riskCategory.color}20`,
                        color: loan.riskCategory.color
                      }}>
                      
                          {loan.riskCategory.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                      onClick={() => setSelectedLoan(loan.id)}
                      className="text-sm text-primary hover:underline">
                      
                          View Details
                        </button>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      }

      {/* CONCENTRATION RISK VIEW */}
      {riskView === 'concentration' &&
      <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="mb-4">Top 10 Borrower Concentration</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={concentrationByBorrower} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Concentration by Loan Purpose</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={concentrationByPurpose} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="purpose" type="category" stroke="#64748b" width={120} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Concentration Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Borrower</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Exposure</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">% of Portfolio</th>
                    <th className="text-left py-3 px-4 text-sm text-muted-foreground">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {concentrationByBorrower.map((item, idx) => {
                  const pct = parseFloat(item.percentage);
                  const risk = pct > 20 ? 'High' : pct > 10 ? 'Medium' : 'Low';
                  const color = pct > 20 ? 'red' : pct > 10 ? 'yellow' : 'green';

                  return (
                    <tr key={idx} className="border-b border-border">
                        <td className="py-3 px-4 text-sm">{item.name}</td>
                        <td className="py-3 px-4 text-sm font-medium">${item.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                              className={`h-full bg-${color}-500`}
                              style={{ width: `${pct}%` }} />
                            
                            </div>
                            <span className="text-sm">{item.percentage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full bg-${color}-100 text-${color}-700`}>
                            {risk}
                          </span>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      }

      {/* STRESS TESTING VIEW */}
      {riskView === 'stress' &&
      <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stressScenarios.map((scenario, idx) =>
          <Card key={idx} className={`p-6 border-l-4 ${
          scenario.severity === 'normal' ? 'border-l-green-500' :
          scenario.severity === 'warning' ? 'border-l-yellow-500' :
          scenario.severity === 'danger' ? 'border-l-orange-500' :
          'border-l-red-500'}`
          }>
                <h3 className="mb-4">{scenario.scenario}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Default Rate</p>
                    <p className="text-2xl font-medium">{scenario.defaultRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Loss</p>
                    <p className="text-xl font-medium">${(scenario.expectedLoss / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <p className={`text-sm ${
                scenario.severity === 'normal' ? 'text-green-600' :
                scenario.severity === 'warning' ? 'text-yellow-600' :
                scenario.severity === 'danger' ? 'text-orange-600' :
                'text-red-600'}`
                }>
                      {scenario.severity === 'normal' ? 'Minimal' :
                  scenario.severity === 'warning' ? 'Moderate' :
                  scenario.severity === 'danger' ? 'Severe' : 'Critical'}
                    </p>
                  </div>
                </div>
              </Card>
          )}
          </div>

          <Card className="p-6 mb-6">
            <h3 className="mb-4">Stress Test Comparison</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stressScenarios}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="scenario" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="defaultRate" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expectedLoss" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <h3 className="mb-4">Scenario Analysis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stress testing evaluates portfolio performance under adverse economic conditions.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-600 mt-0.5" size={16} />
                  <span>Base case assumes normal economic conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="text-yellow-600 mt-0.5" size={16} />
                  <span>Mild recession increases default rates by 50%</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="text-orange-600 mt-0.5" size={16} />
                  <span>Severe recession increases default rates by 150%</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="text-red-600 mt-0.5" size={16} />
                  <span>Financial crisis increases default rates by 300%</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500">
              <h3 className="mb-4">Risk Mitigation Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900 mb-1">Diversification</p>
                  <p className="text-xs text-yellow-700">
                    Reduce concentration in top 3 borrowers to below 15% each
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Credit Enhancement</p>
                  <p className="text-xs text-blue-700">
                    Implement stricter credit requirements for loans above $50K
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900 mb-1">Reserve Building</p>
                  <p className="text-xs text-green-700">
                    Maintain loss reserves at 3-5% of total exposure
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      }

      {/* Loan Detail Modal */}
      {selectedLoanData &&
      <Modal
        isOpen={!!selectedLoanData}
        onClose={() => setSelectedLoan(null)}
        title={`Detailed Risk Assessment - ${selectedLoanData.id}`}
        size="lg">
        
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Borrower</p>
                <p className="text-lg font-medium">{selectedLoanData.borrowerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                <p className="text-lg font-medium">${selectedLoanData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
                <p className="text-lg">{selectedLoanData.creditScore || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-lg">{selectedLoanData.interestRate}%</p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${selectedLoanData.riskCategory.color}20` }}>
              <div className="flex items-center justify-between mb-3">
                <h3>Risk Assessment</h3>
                <span
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: selectedLoanData.riskCategory.color,
                  color: 'white'
                }}>
                
                  {selectedLoanData.riskCategory.label}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Risk Score</span>
                  <span className="text-lg font-medium">{selectedLoanData.riskScore.toFixed(0)}/100</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className="h-full"
                  style={{
                    width: `${selectedLoanData.riskScore}%`,
                    backgroundColor: selectedLoanData.riskCategory.color
                  }} />
                
                </div>
              </div>
              <div className="pt-3 border-t border-gray-300">
                <p className="text-sm font-medium mb-1">Recommended Action:</p>
                <p className="text-sm" style={{ color: selectedLoanData.riskCategory.color }}>
                  {selectedLoanData.riskCategory.action}
                </p>
              </div>
            </div>

            <div className="p-4 bg-secondary rounded-lg">
              <h3 className="mb-3">Risk Factors Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Credit Score Impact:</span>
                  <span className="font-medium">
                    {selectedLoanData.creditScore && selectedLoanData.creditScore >= 740 ? 'Low Risk' :
                  selectedLoanData.creditScore && selectedLoanData.creditScore >= 680 ? 'Medium Risk' : 'High Risk'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Size Impact:</span>
                  <span className="font-medium">
                    {selectedLoanData.amount < 25000 ? 'Low' : selectedLoanData.amount < 75000 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration Impact:</span>
                  <span className="font-medium">
                    {selectedLoanData.duration <= 24 ? 'Low' : selectedLoanData.duration <= 48 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Default Probability:</span>
                  <span className="font-medium text-red-600">
                    {estimateDefaultProbability(selectedLoanData.riskScore).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      }
    </div>);

}