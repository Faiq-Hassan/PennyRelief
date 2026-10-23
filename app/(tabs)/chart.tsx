import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import AuthWrapper from '@/components/AuthWrapper';
import Header from '@/components/Header';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '@/constants/Project.Api';

export default function BankingCharts() {
  const { width } = useWindowDimensions();
  const chartWidth = width - 155;
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError('');
      const response = await axios.get(API_ENDPOINTS.donations);
      setApiData(response.data.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getLastTwoWeeksTransactions = () => {
    if (!apiData?.payments) return [];
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    return apiData.payments
      .filter(payment => new Date(payment.created) > twoWeeksAgo)
      .sort((a, b) => new Date(b.created) - new Date(a.created));
  };

  const prepareMonthlyComparisonData = () => {
    if (!apiData?.summary) return null;

    return {
      labels: ['This Month', 'Last Month'],
      datasets: [{
        data: [
          apiData.summary.thisMonth.amount_pkr,
          apiData.summary.lastMonth.amount_pkr
        ]
      }],
      colors: [
        (opacity = 1) => `rgba(24, 144, 255, ${opacity})`,
        (opacity = 1) => `rgba(108, 117, 125, ${opacity})`
      ],
      growthPercentage: apiData.summary.thisMonth.amount_pkr > 0 ? 
        ((apiData.summary.thisMonth.amount_pkr - apiData.summary.lastMonth.amount_pkr) / 
         apiData.summary.lastMonth.amount_pkr * 100) : 0
    };
  };

  const preparePaymentMethodData = () => {
    if (!apiData?.payments) return null;

    const methodCounts = {};
    apiData.payments.forEach(payment => {
      const method = payment.payment_method?.type || 'unknown';
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });

    const methods = Object.keys(methodCounts);
    if (methods.length === 0) return null;

    return {
      labels: methods.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
      data: methods.map(m => methodCounts[m]),
      colors: methods.map((_, i) => 
        (opacity = 1) => `rgba(${20 + i * 80}, ${100 + i * 50}, ${200 - i * 30}, ${opacity})`
      ),
      totalPayments: apiData.payments.length
    };
  };

  const prepareBalanceData = () => {
    if (!apiData?.account_balance) return null;

    return {
      availableUSD: apiData.summary.thisMonth.amount_usd,
      availablePKR: apiData.summary.thisMonth.amount_pkr,
      pendingUSD: apiData.account_balance.pending.usd,
      pendingPKR: apiData.account_balance.pending.pkr,
      conversionRate: apiData.exchange_rate || 280
    };
  };

  const bankingChartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(24, 144, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#1890ff"
    },
    propsForLabels: {
      fontSize: 11,
      fontFamily: 'SpaceMono'
    },
    fillShadowGradient: '#1890ff',
    fillShadowGradientOpacity: 0.2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false
  };

  const monthlyData = prepareMonthlyComparisonData();
  const paymentMethodData = preparePaymentMethodData();
  const balanceData = prepareBalanceData();
  const lastTwoWeeksTransactions = getLastTwoWeeksTransactions();

  if (loading && !refreshing) {
    return (
      <AuthWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1890ff" />
          <Text style={styles.loadingText}>Loading financial data...</Text>
        </View>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <ScrollView
        style={styles.screenContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1890ff']}
            tintColor="#1890ff"
          />
        }
      >
        <Header />
        <View style={styles.container}>
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color="#dc3545" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Account Balance Summary */}
          {balanceData && (
            <View style={[styles.card, styles.elevatedCard]}>
              <Text style={styles.cardTitle}>Account Balance</Text>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Available USD:</Text>
                  <Text style={styles.balanceValue}>
                    ${balanceData.availableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Available PKR:</Text>
                  <Text style={styles.balanceValue}>
                    PKR {balanceData.availablePKR.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.balanceSubValue}>
                    1$ = {balanceData.conversionRate.toLocaleString('en-PK')} PKR
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Monthly Comparison Chart */}
          {monthlyData && (
            <View style={[styles.card, styles.elevatedCard]}>
              <View style={styles.chartHeader}>
                <Text style={styles.cardTitle}>Monthly Comparison</Text>
                <View style={[
                  styles.growthIndicator,
                  monthlyData.growthPercentage >= 0 ? styles.positiveGrowth : styles.negativeGrowth
                ]}>
                  <MaterialIcons 
                    name={monthlyData.growthPercentage >= 0 ? "trending-up" : "trending-down"} 
                    size={16} 
                    color={monthlyData.growthPercentage >= 0 ? "#28a745" : "#dc3545"} 
                  />
                  <Text style={styles.growthText}>
                    {Math.abs(monthlyData.growthPercentage).toFixed(1)}%
                  </Text>
                </View>
              </View>
              
              <BarChart
                data={{
                  labels: monthlyData.labels,
                  datasets: monthlyData.datasets,
                  barColors: monthlyData.colors
                }}
                width={chartWidth}
                height={220}
                yAxisLabel="PKR "
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  ...bankingChartConfig,
                  barPercentage: 0.5,
                  propsForBackgroundLines: {
                    strokeWidth: 1,
                    stroke: '#e9ecef',
                    strokeDasharray: '0'
                  },
                  fillShadowGradient: '#1890ff',
                  fillShadowGradientOpacity: 0.2,
                }}
                style={styles.chartStyle}
                verticalLabelRotation={0}
                fromZero={true}
                showBarTops={true}
                withInnerLines={false}
                withHorizontalLabels={true}
                withVerticalLabels={true}
              />

              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>This Month</Text>
                  <Text style={styles.summaryValue}>
                    PKR {apiData.summary.thisMonth.amount_pkr.toLocaleString('en-PK')}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Last Month</Text>
                  <Text style={styles.summaryValue}>
                    PKR {apiData.summary.lastMonth.amount_pkr.toLocaleString('en-PK')}
                  </Text>
                </View>
              </View>
            </View>
          )}

     {/* Payment Methods Distribution */}
{paymentMethodData && (
  <View style={[styles.card, styles.elevatedCard]}>
    <View style={styles.chartHeader}>
      <Text style={styles.cardTitle}>Payment Methods</Text>
      <Text style={styles.paymentTotal}>
        Total: {paymentMethodData.totalPayments} transactions
      </Text>
    </View>
    
    <View style={styles.pieChartContainer}>
      <PieChart
        data={paymentMethodData.labels.map((label, i) => ({
          name: label,
          population: paymentMethodData.data[i],
          color: paymentMethodData.colors[i](1),
          legendFontColor: '#6c757d',
          legendFontSize: 12
        }))}
        width={chartWidth}
        height={180}
        chartConfig={{
          ...bankingChartConfig,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
        hasLegend={false}
        avoidFalseZero
        style={{
          marginLeft: -20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      />
      
      <View style={styles.legendContainer}>
        {paymentMethodData.labels.map((label, i) => {
          const percentage = ((paymentMethodData.data[i] / paymentMethodData.totalPayments) * 100).toFixed(0);
          return (
            <View key={i} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View style={[
                  styles.legendColor,
                  { 
                    backgroundColor: paymentMethodData.colors[i](1),
                    shadowColor: paymentMethodData.colors[i](1),
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 3,
                  }
                ]} />
                <Text style={styles.legendLabel}>{label}</Text>
              </View>
              <View style={styles.legendRight}>
                <Text style={styles.legendPercentage}>{percentage}%</Text>
                <Text style={styles.legendCount}>({paymentMethodData.data[i]})</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  </View>
)}

          {/* Recent Transactions */}
          {apiData?.payments && (
            <View style={[styles.card, styles.elevatedCard]}>
              <Text style={styles.cardTitle}>Recent Transactions</Text>
              {apiData.payments.slice(0, 5).map((payment, index) => (
                <View key={index} style={[
                  styles.transactionItem,
                  index < apiData.payments.length - 1 && styles.transactionDivider
                ]}>
                  <View style={styles.transactionLeft}>
                    <MaterialIcons 
                      name={payment.status === 'succeeded' ? "check-circle" : "pending"} 
                      size={20} 
                      color={payment.status === 'succeeded' ? "#28a745" : "#ffc107"} 
                    />
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionName}>
                        {payment.customer?.name || 'Anonymous'}
                      </Text>
                      <Text style={styles.transactionMethod}>
                        {payment.payment_method?.type || 'Unknown method'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={styles.transactionAmount}>
                      PKR {payment.amount.pkr.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(payment.created).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
              {apiData.payments.length > 5 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setShowAllTransactionsModal(true)}
                >
                  <Text style={styles.viewAllText}>View All Transactions</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Transactions Modal */}
      <Modal
        visible={showAllTransactionsModal}
        animationType="slide"
        onRequestClose={() => setShowAllTransactionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Last Two Weeks Transactions</Text>
            <TouchableOpacity 
              onPress={() => setShowAllTransactionsModal(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {lastTwoWeeksTransactions.map((payment, index) => (
              <View key={index} style={[
                styles.modalTransactionItem,
                index < lastTwoWeeksTransactions.length - 1 && styles.transactionDivider
              ]}>
                <View style={styles.transactionLeft}>
                  <MaterialIcons 
                    name={payment.status === 'succeeded' ? "check-circle" : "pending"} 
                    size={20} 
                    color={payment.status === 'succeeded' ? "#28a745" : "#ffc107"} 
                  />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName}>
                      {payment.customer?.name || 'Anonymous'}
                    </Text>
                    <Text style={styles.transactionMethod}>
                      {payment.payment_method?.type || 'Unknown method'}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.transactionAmount}>
                    PKR {payment.amount.pkr.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(payment.created).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d'
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f5c6cb'
  },
  paymentTotal: {
  fontSize: 12,
  color: '#6c757d',
  fontWeight: '500',
},
pieChartContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 10,
},
legendContainer: {
  flex: 1,
  paddingLeft: 16,
  paddingRight: 8,
},
legendItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  paddingVertical: 4,
},
legendLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},
legendRight: {
  flexDirection: 'row',
  alignItems: 'center',
},
legendColor: {
  width: 16,
  height: 16,
  borderRadius: 8,
  marginRight: 12,
},
legendLabel: {
  fontSize: 13,
  color: '#495057',
  fontWeight: '500',
  flexShrink: 1,
},
legendPercentage: {
  fontSize: 14,
  fontWeight: '600',
  color: '#212529',
  minWidth: 40,
  textAlign: 'right',
},
legendCount: {
  fontSize: 12,
  color: '#6c757d',
  marginLeft: 6,
  width: 50,
},
  errorText: {
    color: '#721c24',
    fontSize: 14,
    marginLeft: 8,
    flex: 1
  },
  retryButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#dc3545',
    borderRadius: 4
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
    fontFamily: 'SpaceMono'
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  balanceItem: {
    flex: 1
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529'
  },
  balanceSubValue: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  chartStyle: {
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: -10
  },
  growthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12
  },
  positiveGrowth: {
    backgroundColor: 'rgba(40, 167, 69, 0.1)'
  },
  negativeGrowth: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)'
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef'
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529'
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 16
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  legendText: {
    fontSize: 12,
    color: '#6c757d'
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  transactionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef'
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  transactionDetails: {
    marginLeft: 12,
    flex: 1
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529'
  },
  transactionMethod: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2
  },
  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 8
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529'
  },
  transactionDate: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2
  },
  viewAllButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center'
  },
  viewAllText: {
    color: '#1890ff',
    fontSize: 14,
    fontWeight: '500'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  closeButton: {
    padding: 4
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalTransactionItem: {
    paddingVertical: 12,
    paddingHorizontal: 8
  },
});